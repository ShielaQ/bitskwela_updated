from decimal import Decimal
from unittest.mock import Mock, patch

from django.core.cache import cache
from django.test import TestCase

from ai.llm_client import LLMServiceError
from ai.services import forecast_crypto_return


class ForecastServiceTests(TestCase):
    def setUp(self):
        cache.clear()

    @patch("ai.services.LLMClient")
    @patch("ai.services.ForecastClient")
    def test_forecast_return_uses_deterministic_mocks_and_cache(self, forecast_client_cls, llm_client_cls):
        forecast_client = Mock()
        forecast_client.forecast.return_value = {
            "annual_return": 0.42,
            "confidence": 0.73,
            "provider_meta": {"source": "mock-forecast"},
        }
        forecast_client_cls.return_value = forecast_client

        llm_client = Mock()
        llm_client.available.return_value = True
        llm_client.interpret_forecast.return_value = {
            "summary": "mock summary",
            "confidence_adjustment": 0.01,
            "provider_meta": {"source": "mock-llm"},
        }
        llm_client_cls.return_value = llm_client

        first = forecast_crypto_return(instrument_key="bitcoin", amount=1000, horizon_days=30, mode="moderate")
        second = forecast_crypto_return(instrument_key="bitcoin", amount=1000, horizon_days=30, mode="moderate")

        self.assertEqual(first["annual_return"], Decimal("0.42"))
        self.assertEqual(first["forecast_confidence"], 0.73)
        self.assertEqual(second["forecast_meta"]["source"], "mock-forecast")
        self.assertEqual(forecast_client.forecast.call_count, 1)

    @patch("ai.services.LLMClient")
    @patch("ai.services.ForecastClient")
    def test_forecast_return_handles_llm_failure_with_warning(self, forecast_client_cls, llm_client_cls):
        forecast_client = Mock()
        forecast_client.forecast.return_value = {
            "annual_return": 0.15,
            "confidence": 0.5,
            "provider_meta": {},
        }
        forecast_client_cls.return_value = forecast_client

        llm_client = Mock()
        llm_client.available.return_value = True
        llm_client.interpret_forecast.side_effect = LLMServiceError("llm down")
        llm_client_cls.return_value = llm_client

        result = forecast_crypto_return(instrument_key="ethereum", amount=2500, horizon_days=90, mode="moderate")

        self.assertIsNotNone(result["llm_warning"])
        self.assertIsNone(result["llm_info"])
