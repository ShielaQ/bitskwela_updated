import uuid
from decimal import Decimal
from unittest.mock import patch

from requests import RequestException
from django.contrib.auth.models import User
from django.core.cache import cache
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import UserProfile
from ai.services import ForecastServiceError
from calculator.constants import CRYPTO_BASELINE_RETURNS, TRADITIONAL_INSTRUMENTS
from calculator.models import CalculationSession
from calculator.rates_provider import RATES_CACHE_KEY, get_live_rates_snapshot
from calculator.serializers import CalculateSerializer
from calculator.services import calculate_projection


def _cached_rates_snapshot():
    traditional = []
    for item in TRADITIONAL_INSTRUMENTS:
        record = dict(item)
        record["source"] = "test_seed"
        record["source_url"] = None
        record["updated_at"] = "2024-01-01"
        record["is_fallback"] = False
        traditional.append(record)

    crypto = []
    for key, value in CRYPTO_BASELINE_RETURNS.items():
        crypto.append(
            {
                "key": key,
                "label": key,
                "annual_return": value,
                "rate_type": "baseline_assumption",
                "source": "test_seed",
                "source_url": None,
                "updated_at": "2024-01-01",
                "is_fallback": False,
            }
        )
    return {
        "traditional_rates": traditional,
        "crypto_rate_proxies": crypto,
        "updated_at": "2024-01-01T00:00:00+00:00",
        "fallback_used": False,
    }


class CalculatorServiceTests(APITestCase):
    def setUp(self):
        cache.clear()
        cache.set(RATES_CACHE_KEY, _cached_rates_snapshot(), timeout=60)

    def test_traditional_projection_is_deterministic(self):
        result = calculate_projection(
            instrument_type="traditional",
            instrument_key="pagibig_mp2",
            amount=Decimal("1000.00"),
            horizon_days=365,
            mode="moderate",
        )

        self.assertEqual(result["source"], "traditional_baseline")
        self.assertEqual(result["instrument_key"], "pagibig_mp2")
        self.assertGreater(result["projected_value"], 1000.0)
        self.assertTrue(len(result["chart_data"]) > 0)

    @patch("calculator.services.forecast_crypto_return", side_effect=ForecastServiceError("forecast unavailable"))
    def test_crypto_projection_falls_back_to_baseline_on_forecast_failure(self, _forecast_mock):
        result = calculate_projection(
            instrument_type="crypto",
            instrument_key="bitcoin",
            amount=Decimal("1000.00"),
            horizon_days=30,
            mode="moderate",
        )

        self.assertEqual(result["source"], "crypto_baseline_degraded")
        self.assertTrue(result["degraded"])
        self.assertIn("forecast unavailable", result["degradation_reason"])


class CalculatorSerializerTests(APITestCase):
    def test_calculate_serializer_rejects_invalid_payload(self):
        serializer = CalculateSerializer(
            data={
                "instrument_type": "crypto",
                "instrument_key": "bitcoin",
                "amount": "0",
                "horizon_days": 0,
                "mode": "invalid-mode",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)
        self.assertIn("horizon_days", serializer.errors)
        self.assertIn("mode", serializer.errors)

    def test_calculate_serializer_maps_frontend_aliases(self):
        cases = [
            ("traditional", "pagibig", "pagibig_mp2"),
            ("traditional", "tbill", "tbill_rtb"),
            ("traditional", "td", "bank_time_deposit"),
            ("traditional", "realestate", "real_estate_baseline"),
            ("crypto", "usdt", "tether"),
        ]
        for instrument_type, instrument_key, expected in cases:
            serializer = CalculateSerializer(
                data={
                    "instrument_type": instrument_type,
                    "instrument_key": instrument_key,
                    "amount": "1000",
                    "horizon_days": 30,
                    "mode": "moderate",
                }
            )
            self.assertTrue(serializer.is_valid())
            self.assertEqual(serializer.validated_data["instrument_key"], expected)


class CalculatorAPITests(APITestCase):
    def setUp(self):
        cache.clear()
        cache.set(RATES_CACHE_KEY, _cached_rates_snapshot(), timeout=60)
        self.user = User.objects.create_user(username="calc_user", password="x")
        UserProfile.objects.create(
            user=self.user,
            supabase_user_id=uuid.uuid4(),
            email="calc_user@test.local",
        )

    def test_calculate_requires_authentication(self):
        response = self.client.post(
            reverse("calculate"),
            {
                "instrument_type": "traditional",
                "instrument_key": "pagibig_mp2",
                "amount": "1000.00",
                "horizon_days": 30,
                "mode": "moderate",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 401)

    def test_calculate_returns_contract_and_persists_session(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("calculate"),
            {
                "instrument_type": "traditional",
                "instrument_key": "pagibig_mp2",
                "amount": "1000.00",
                "horizon_days": 30,
                "mode": "moderate",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["message"], "Projection calculated")
        self.assertIsNone(response.data["error"])
        self.assertIn("session_id", response.data["data"])
        self.assertIn("projected", response.data["data"])
        self.assertIn("projected_value", response.data["data"])
        self.assertIn("chartData", response.data["data"])
        self.assertIn("chart_data", response.data["data"])
        self.assertEqual(CalculationSession.objects.filter(user=self.user).count(), 1)

    def test_calculate_accepts_frontend_alias_instrument_key(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("calculate"),
            {
                "instrument_type": "traditional",
                "instrument_key": "tbill",
                "amount": "1000.00",
                "horizon_days": 30,
                "mode": "moderate",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["instrument_key"], "tbill_rtb")

    @patch("calculator.views.CoinGeckoClient.get_top_coins", side_effect=RequestException("coingecko offline"))
    def test_crypto_instruments_endpoint_falls_back_when_provider_fails(self, _coin_mock):
        response = self.client.get(reverse("calculator-crypto-instruments"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["provider"], "fallback_baseline")
        self.assertTrue(response.data["data"]["degraded"])
        self.assertTrue(len(response.data["data"]["items"]) > 0)

    @patch("calculator.rates_provider.requests.get")
    def test_rates_endpoint_returns_dynamic_metadata_shape(self, requests_get_mock):
        cache.clear()
        def _mock_response(url, params=None, **_kwargs):
            class _Resp:
                def __init__(self, status_code, text=None, json_data=None):
                    self.status_code = status_code
                    self.text = text
                    self._json_data = json_data

                def raise_for_status(self):
                    if self.status_code >= 400:
                        raise Exception(f"HTTP {self.status_code}")

                def json(self):
                    return self._json_data

            if "fredgraph.csv" in url and params.get("id") == "DTB3":
                return _Resp(200, "DATE,DTB3\n2025-01-01,5.20\n")
            if "fredgraph.csv" in url and params.get("id") == "DGS5":
                return _Resp(200, "DATE,DGS5\n2025-01-01,4.10\n")
            if "fredgraph.csv" in url and params.get("id") == "QPHR628BIS":
                return _Resp(
                    200,
                    "DATE,QPHR628BIS\n2024-01-01,130\n2024-04-01,132\n2024-07-01,133\n"
                    "2024-10-01,134\n2025-01-01,136\n",
                )
            if "api.worldbank.org" in url:
                return _Resp(
                    200,
                    json_data=[{}, [{"date": "2024", "value": 2.0}]],
                )
            if "yields.llama.fi" in url:
                return _Resp(
                    200,
                    json_data={
                        "data": [
                            {"symbol": "USDT", "apy": 8.5, "tvlUsd": 2000000},
                            {"symbol": "USDT", "apy": 7.5, "tvlUsd": 3000000},
                        ]
                    },
                )
            if "api.coingecko.com" in url and "coins/markets" in url:
                return _Resp(
                    200,
                    json_data=[
                        {"id": "bitcoin", "price_change_percentage_30d_in_currency": 6.0},
                        {"id": "ethereum", "price_change_percentage_30d_in_currency": 4.0},
                    ],
                )
            return _Resp(404, "")

        requests_get_mock.side_effect = _mock_response

        response = self.client.get(reverse("rates"))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertIn("traditional_rates", response.data["data"])
        self.assertIn("crypto_rate_proxies", response.data["data"])
        self.assertIn("fallback_used", response.data["data"])

        traditional_map = {item["key"]: item for item in response.data["data"]["traditional_rates"]}
        crypto_map = {item["key"]: item for item in response.data["data"]["crypto_rate_proxies"]}
        self.assertAlmostEqual(traditional_map["tbill_rtb"]["annual_return"], 0.052, places=6)
        self.assertEqual(traditional_map["tbill_rtb"]["source"], "FRED: DTB3")
        self.assertFalse(traditional_map["tbill_rtb"]["is_fallback"])
        self.assertFalse(crypto_map["bitcoin"]["is_fallback"])
        self.assertEqual(crypto_map["bitcoin"]["source"], "CoinGecko 30d trend proxy")

    @patch("calculator.rates_provider.requests.get", side_effect=Exception("source offline"))
    def test_rates_endpoint_uses_fallback_when_fetch_fails(self, _requests_get_mock):
        cache.clear()
        response = self.client.get(reverse("rates"))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["data"]["fallback_used"])
        self.assertTrue(all(item["is_fallback"] for item in response.data["data"]["traditional_rates"]))


class LiveRatesProviderTests(APITestCase):
    def setUp(self):
        cache.clear()

    @patch("calculator.rates_provider.requests.get", side_effect=Exception("network down"))
    def test_live_rates_snapshot_fallback_mode(self, _requests_get_mock):
        snapshot = get_live_rates_snapshot(force_refresh=True)
        self.assertTrue(snapshot["fallback_used"])
        self.assertTrue(all(item["is_fallback"] for item in snapshot["traditional_rates"]))

    @patch("calculator.rates_provider._fetch_usdt_defi_proxy", return_value=(0.09, "2025-01-01T00:00:00+00:00"))
    @patch("calculator.rates_provider._fetch_coingecko_crypto_proxies", side_effect=Exception("coingecko down"))
    @patch("calculator.rates_provider._fetch_real_estate_proxy_yoy", return_value=(0.07, "2025-01-01"))
    @patch("calculator.rates_provider._fetch_world_bank_latest_rate", return_value=(2.0, "2024"))
    @patch("calculator.rates_provider._fetch_fred_latest_rate")
    def test_live_rates_snapshot_keeps_crypto_fallback_when_coingecko_fails(
        self,
        fred_mock,
        _world_bank_mock,
        _real_estate_mock,
        _coingecko_mock,
        _usdt_mock,
    ):
        fred_mock.side_effect = [(5.2, "2025-01-01"), (4.1, "2025-01-01")]

        snapshot = get_live_rates_snapshot(force_refresh=True)
        crypto_map = {item["key"]: item for item in snapshot["crypto_rate_proxies"]}

        self.assertTrue(snapshot["fallback_used"])
        self.assertTrue(crypto_map["bitcoin"]["is_fallback"])
