import os

import requests


class ForecastServiceError(Exception):
    pass


class ForecastClient:
    def __init__(self):
        self.base_url = os.getenv("AI_FORECAST_SERVICE_URL", "").rstrip("/")
        self.endpoint = os.getenv("AI_FORECAST_ENDPOINT", "/forecast")
        self.timeout = int(os.getenv("AI_FORECAST_TIMEOUT_SECONDS", "20"))
        self.api_key = os.getenv("AI_FORECAST_API_KEY", "").strip()
        self.api_key_header = os.getenv("AI_FORECAST_API_KEY_HEADER", "x-api-key").strip()

    def _headers(self):
        headers = {"accept": "application/json", "content-type": "application/json"}
        if self.api_key:
            headers[self.api_key_header] = self.api_key
        return headers

    def available(self):
        return bool(self.base_url)

    def forecast(self, payload):
        if not self.available():
            raise ForecastServiceError("Forecast service URL is not configured")

        url = f"{self.base_url}{self.endpoint}"
        try:
            response = requests.post(url, json=payload, headers=self._headers(), timeout=self.timeout)
            response.raise_for_status()
            body = response.json()
        except requests.RequestException as exc:
            raise ForecastServiceError(f"Forecast service request failed: {exc}") from exc
        except ValueError as exc:
            raise ForecastServiceError("Forecast service returned non-JSON response") from exc

        annual_return = body.get("annual_return")
        if annual_return is None:
            raise ForecastServiceError("Forecast response missing annual_return")

        return {
            "annual_return": annual_return,
            "confidence": body.get("confidence"),
            "provider_meta": body.get("meta", {}),
        }

