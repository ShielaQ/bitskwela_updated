import csv
import os
from copy import deepcopy
from datetime import UTC, datetime
from statistics import median

import requests
from django.core.cache import cache

from .constants import CRYPTO_BASELINE_RETURNS, TRADITIONAL_INSTRUMENTS
from .coingecko import CoinGeckoClient

FRED_CSV_BASE_URL = "https://fred.stlouisfed.org/graph/fredgraph.csv"
WORLD_BANK_BASE_URL = "https://api.worldbank.org/v2/country/PHL/indicator"
DEFILLAMA_YIELDS_URL = "https://yields.llama.fi/pools"
RATES_CACHE_KEY = "calculator:live_rates_snapshot:v1"


class RatesProviderError(Exception):
    pass


def _utc_now_iso():
    return datetime.now(UTC).replace(microsecond=0).isoformat()


def _request_json(url, *, params=None):
    timeout = int(os.getenv("CALCULATOR_RATES_TIMEOUT_SECONDS", "12"))
    user_agent = os.getenv("CALCULATOR_RATES_USER_AGENT", "BitskwelaCalculator/1.0 (+https://bitskwela.com)")
    response = requests.get(url, params=params, timeout=timeout, headers={"User-Agent": user_agent})
    response.raise_for_status()
    return response.json()


def _request_text(url, *, params=None):
    timeout = int(os.getenv("CALCULATOR_RATES_TIMEOUT_SECONDS", "12"))
    user_agent = os.getenv("CALCULATOR_RATES_USER_AGENT", "BitskwelaCalculator/1.0 (+https://bitskwela.com)")
    response = requests.get(url, params=params, timeout=timeout, headers={"User-Agent": user_agent})
    response.raise_for_status()
    return response.text


def _fetch_fred_latest_rate(series_id):
    text = _request_text(FRED_CSV_BASE_URL, params={"id": series_id})
    reader = csv.DictReader(text.splitlines())
    latest = None
    for row in reader:
        value = (row.get(series_id) or "").strip()
        if not value or value == ".":
            continue
        latest = row
    if latest is None:
        raise RatesProviderError(f"No usable data found for FRED series {series_id}")
    return float(latest[series_id]), latest["DATE"]


def _fetch_world_bank_latest_rate(indicator_code):
    payload = _request_json(
        f"{WORLD_BANK_BASE_URL}/{indicator_code}",
        params={"format": "json", "per_page": 120},
    )
    if not isinstance(payload, list) or len(payload) < 2 or not isinstance(payload[1], list):
        raise RatesProviderError(f"Unexpected World Bank payload for {indicator_code}")

    for row in payload[1]:
        value = row.get("value")
        if value is None:
            continue
        return float(value), str(row.get("date"))
    raise RatesProviderError(f"No usable World Bank value found for {indicator_code}")


def _fetch_real_estate_proxy_yoy():
    text = _request_text(FRED_CSV_BASE_URL, params={"id": "QPHR628BIS"})
    reader = csv.DictReader(text.splitlines())
    rows = []
    for row in reader:
        value = (row.get("QPHR628BIS") or "").strip()
        if not value or value == ".":
            continue
        rows.append((row["DATE"], float(value)))
    if len(rows) < 5:
        raise RatesProviderError("Not enough observations to derive real estate YoY proxy")

    latest_date, latest = rows[-1]
    _, prev_year = rows[-5]
    yoy = (latest / prev_year) - 1
    return yoy, latest_date


def _fetch_usdt_defi_proxy():
    payload = _request_json(DEFILLAMA_YIELDS_URL)
    pools = payload.get("data", []) if isinstance(payload, dict) else []
    min_tvl = float(os.getenv("DEFILLAMA_USDT_MIN_TVL_USD", "1000000"))
    apys = []
    for pool in pools:
        symbol = str(pool.get("symbol", "")).upper()
        apy = pool.get("apy")
        tvl_usd = pool.get("tvlUsd") or 0
        if "USDT" not in symbol or apy is None:
            continue
        if float(tvl_usd) < min_tvl:
            continue
        apy_value = float(apy)
        if 0 < apy_value < 100:
            apys.append(apy_value / 100)

    if not apys:
        raise RatesProviderError("No usable USDT APY pool data found")
    return float(median(apys)), _utc_now_iso()


def _fetch_coingecko_crypto_proxies():
    raw_ids = os.getenv(
        "COINGECKO_LIVE_RATE_COINS",
        "bitcoin,ethereum,solana,tether,usd-coin",
    )
    coin_ids = [item.strip().lower() for item in raw_ids.split(",") if item.strip()]
    if not coin_ids:
        return {}

    vs_currency = os.getenv("COINGECKO_LIVE_RATE_VS_CURRENCY", "usd").strip().lower() or "usd"
    annualization_multiplier = float(os.getenv("COINGECKO_TREND_ANNUALIZATION_MULTIPLIER", "12"))
    max_abs_return = float(os.getenv("COINGECKO_TREND_MAX_ABS_RETURN", "5"))
    per_page = max(1, min(len(coin_ids), 250))

    client = CoinGeckoClient()
    markets = client.get_markets(
        vs_currency=vs_currency,
        per_page=per_page,
        page=1,
        ids=coin_ids,
        price_change_percentage="30d",
    )

    by_key = {}
    for coin in markets:
        key = str(coin.get("id", "")).strip().lower()
        if not key:
            continue
        change_30d = coin.get("price_change_percentage_30d_in_currency")
        if change_30d is None:
            continue

        annual_return = (float(change_30d) / 100) * annualization_multiplier
        annual_return = max(-max_abs_return, min(annual_return, max_abs_return))
        by_key[key] = {
            "annual_return": annual_return,
            "source": "CoinGecko 30d trend proxy",
            "source_url": "https://www.coingecko.com/",
            "updated_at": _utc_now_iso(),
            "rate_type": "market_trend_30d_annualized_proxy",
        }
    return by_key


def _build_fallback_snapshot():
    traditional = deepcopy(TRADITIONAL_INSTRUMENTS)
    for item in traditional:
        item["source"] = "fallback_baseline"
        item["source_url"] = None
        item["updated_at"] = item.get("last_updated")
        item["is_fallback"] = True

    crypto = []
    for key, value in CRYPTO_BASELINE_RETURNS.items():
        crypto.append(
            {
                "key": key,
                "label": key.replace("-", " ").title(),
                "annual_return": value,
                "rate_type": "baseline_assumption",
                "source": "fallback_baseline",
                "source_url": None,
                "updated_at": None,
                "is_fallback": True,
            }
        )

    return {
        "traditional_rates": traditional,
        "crypto_rate_proxies": crypto,
        "updated_at": _utc_now_iso(),
        "fallback_used": True,
    }


def get_live_rates_snapshot(*, force_refresh=False):
    if not force_refresh:
        cached = cache.get(RATES_CACHE_KEY)
        if cached is not None:
            return cached

    snapshot = _build_fallback_snapshot()
    traditional_by_key = {item["key"]: item for item in snapshot["traditional_rates"]}
    crypto_by_key = {item["key"]: item for item in snapshot["crypto_rate_proxies"]}
    fallback_used = False

    def _set_rate(key, annual_return, source, source_url, updated_at, rate_type=None):
        target = traditional_by_key.get(key) or crypto_by_key.get(key)
        if not target:
            return
        target["annual_return"] = round(float(annual_return), 6)
        if rate_type:
            target["rate_type"] = rate_type
        target["source"] = source
        target["source_url"] = source_url
        target["updated_at"] = updated_at
        target["last_updated"] = str(updated_at)[:10]
        target["is_fallback"] = False

    try:
        tbill_rate, tbill_date = _fetch_fred_latest_rate("DTB3")
        _set_rate(
            "tbill_rtb",
            tbill_rate / 100,
            "FRED: DTB3",
            "https://fred.stlouisfed.org/series/DTB3",
            tbill_date,
            "market_yield_proxy",
        )
    except Exception:
        fallback_used = True

    try:
        five_year_rate, five_year_date = _fetch_fred_latest_rate("DGS5")
        mp2_proxy = (five_year_rate / 100) + 0.01
        _set_rate(
            "pagibig_mp2",
            mp2_proxy,
            "FRED: DGS5 (+1.0% spread proxy)",
            "https://fred.stlouisfed.org/series/DGS5",
            five_year_date,
            "proxy_5y_gov_bond_plus_spread",
        )
        _set_rate(
            "pagibig_regular",
            max(mp2_proxy - 0.005, 0.0),
            "Derived from Pag-IBIG MP2 proxy",
            "https://fred.stlouisfed.org/series/DGS5",
            five_year_date,
            "derived_proxy",
        )
    except Exception:
        fallback_used = True

    try:
        deposit_rate, deposit_year = _fetch_world_bank_latest_rate("FR.INR.DPST")
        deposit_decimal = deposit_rate / 100
        _set_rate(
            "bank_time_deposit",
            deposit_decimal,
            "World Bank: FR.INR.DPST",
            "https://api.worldbank.org/v2/country/PHL/indicator/FR.INR.DPST?format=json",
            deposit_year,
            "country_deposit_rate_proxy",
        )
        _set_rate(
            "sss_peso",
            min(deposit_decimal + 0.005, 0.20),
            "Derived from World Bank deposit rate proxy",
            "https://api.worldbank.org/v2/country/PHL/indicator/FR.INR.DPST?format=json",
            deposit_year,
            "derived_proxy",
        )
    except Exception:
        fallback_used = True

    try:
        real_estate_yoy, real_estate_date = _fetch_real_estate_proxy_yoy()
        _set_rate(
            "real_estate_baseline",
            real_estate_yoy,
            "FRED: QPHR628BIS YoY",
            "https://fred.stlouisfed.org/series/QPHR628BIS",
            real_estate_date,
            "residential_price_index_yoy_proxy",
        )
    except Exception:
        fallback_used = True

    try:
        usdt_apy, usdt_updated_at = _fetch_usdt_defi_proxy()
        _set_rate(
            "tether",
            usdt_apy,
            "DeFiLlama USDT pool median APY",
            "https://yields.llama.fi/pools",
            usdt_updated_at,
            "defi_stablecoin_yield_proxy",
        )
    except Exception:
        fallback_used = True

    try:
        coingecko_proxies = _fetch_coingecko_crypto_proxies()
        for key, data in coingecko_proxies.items():
            _set_rate(
                key,
                data["annual_return"],
                data["source"],
                data["source_url"],
                data["updated_at"],
                data["rate_type"],
            )
    except Exception:
        fallback_used = True

    snapshot["fallback_used"] = fallback_used or any(
        item["is_fallback"] for item in snapshot["traditional_rates"] + snapshot["crypto_rate_proxies"]
    )
    snapshot["updated_at"] = _utc_now_iso()

    cache_ttl = int(os.getenv("LIVE_RATES_CACHE_TTL_SECONDS", "21600"))
    cache.set(RATES_CACHE_KEY, snapshot, timeout=cache_ttl)
    return snapshot
