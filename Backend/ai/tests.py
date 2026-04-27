import os
from decimal import Decimal
from unittest.mock import Mock, patch

from django.core.cache import cache
from django.test import TestCase

from ai.llm_client import LLMClient, LLMServiceError
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


class GeminiLLMClientTests(TestCase):
    @patch.dict(
        os.environ,
        {
            "AI_LLM_PROVIDER": "gemini",
            "AI_GEMINI_API_KEY": "test-key",
            "AI_GEMINI_MODEL": "gemini-1.5-flash",
        },
        clear=False,
    )
    @patch("ai.llm_client.requests.post")
    def test_chat_response_uses_gemini_flash(self, post_mock):
        post_mock.return_value = Mock(
            raise_for_status=Mock(),
            json=Mock(
                return_value={
                    "candidates": [
                        {"content": {"parts": [{"text": "Gemini reply"}]}},
                    ]
                }
            ),
        )

        client = LLMClient()
        result = client.chat_response({"message": "Hello", "intent": "general", "context": {}})

        self.assertEqual(result["reply"], "Gemini reply")
        self.assertEqual(result["meta"]["provider"], "gemini")
        self.assertEqual(result["meta"]["model"], "gemini-1.5-flash")
        called_url = post_mock.call_args.args[0]
        self.assertIn("/models/gemini-1.5-flash:generateContent", called_url)
        self.assertIn("key=test-key", called_url)

    @patch.dict(os.environ, {"AI_LLM_PROVIDER": "gemini", "AI_GEMINI_API_KEY": ""}, clear=False)
    def test_gemini_requires_api_key(self):
        client = LLMClient()
        self.assertFalse(client.available())
        self.assertEqual(client.unavailable_reason(), "Gemini API key is not configured")

    @patch.dict(
        os.environ,
        {"AI_LLM_PROVIDER": "", "AI_LLM_SERVICE_URL": "", "GEMINI_API_KEY": "from-gemini-key"},
        clear=False,
    )
    def test_provider_defaults_to_gemini_when_only_gemini_key_is_set(self):
        client = LLMClient()
        self.assertEqual(client.provider, "gemini")
        self.assertTrue(client.available())
