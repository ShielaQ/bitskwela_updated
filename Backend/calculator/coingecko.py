import os

import requests


class CoinGeckoClient:
    def __init__(self):
        self.base_url = os.getenv("COINGECKO_API_BASE_URL", "https://api.coingecko.com/api/v3").rstrip("/")
        self.timeout = int(os.getenv("COINGECKO_TIMEOUT_SECONDS", "15"))
        self.api_key = os.getenv("COINGECKO_API_KEY", "").strip()
        self.api_key_header = os.getenv("COINGECKO_API_KEY_HEADER", "x-cg-demo-api-key").strip()

    def _headers(self):
        headers = {"accept": "application/json"}
        if self.api_key:
            headers[self.api_key_header] = self.api_key
        return headers

    def get_top_coins(self, vs_currency="php", per_page=20, page=1):
        url = f"{self.base_url}/coins/markets"
        params = {
            "vs_currency": vs_currency,
            "order": "market_cap_desc",
            "per_page": per_page,
            "page": page,
            "sparkline": "false",
            "price_change_percentage": "24h",
        }

        response = requests.get(url, params=params, headers=self._headers(), timeout=self.timeout)
        response.raise_for_status()
        coins = response.json()

        return [
            {
                "key": coin.get("id"),
                "symbol": coin.get("symbol"),
                "name": coin.get("name"),
                "image": coin.get("image"),
                "current_price": coin.get("current_price"),
                "market_cap": coin.get("market_cap"),
                "market_cap_rank": coin.get("market_cap_rank"),
                "price_change_percentage_24h": coin.get("price_change_percentage_24h"),
            }
            for coin in coins
        ]

