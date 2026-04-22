import os

import requests


class LLMServiceError(Exception):
    pass


class LLMClient:
    def __init__(self):
        self.base_url = os.getenv("AI_LLM_SERVICE_URL", "").rstrip("/")
        self.endpoint = os.getenv("AI_LLM_ENDPOINT", "/interpret")
        self.chat_endpoint = os.getenv("AI_LLM_CHAT_ENDPOINT", "/chat")
        self.timeout = int(os.getenv("AI_LLM_TIMEOUT_SECONDS", "20"))
        self.api_key = os.getenv("AI_LLM_API_KEY", "").strip()
        self.api_key_header = os.getenv("AI_LLM_API_KEY_HEADER", "Authorization").strip()

    def available(self):
        return bool(self.base_url)

    def _headers(self):
        headers = {"accept": "application/json", "content-type": "application/json"}
        if self.api_key:
            if self.api_key_header.lower() == "authorization":
                headers[self.api_key_header] = f"Bearer {self.api_key}"
            else:
                headers[self.api_key_header] = self.api_key
        return headers

    def interpret_forecast(self, payload):
        if not self.available():
            raise LLMServiceError("LLM service URL is not configured")

        url = f"{self.base_url}{self.endpoint}"
        try:
            response = requests.post(url, json=payload, headers=self._headers(), timeout=self.timeout)
            response.raise_for_status()
            body = response.json()
        except requests.RequestException as exc:
            raise LLMServiceError(f"LLM service request failed: {exc}") from exc
        except ValueError as exc:
            raise LLMServiceError("LLM service returned non-JSON response") from exc

        return {
            "summary": body.get("summary"),
            "confidence_adjustment": body.get("confidence_adjustment"),
            "provider_meta": body.get("meta", {}),
        }

    def chat_response(self, payload):
        if not self.available():
            raise LLMServiceError("LLM service URL is not configured")

        url = f"{self.base_url}{self.chat_endpoint}"
        try:
            response = requests.post(url, json=payload, headers=self._headers(), timeout=self.timeout)
            response.raise_for_status()
            body = response.json()
        except requests.RequestException as exc:
            raise LLMServiceError(f"LLM chat request failed: {exc}") from exc
        except ValueError as exc:
            raise LLMServiceError("LLM chat service returned non-JSON response") from exc

        reply = body.get("reply") or body.get("text") or body.get("message")
        if not reply:
            raise LLMServiceError("LLM chat response missing reply field")

        return {
            "reply": reply,
            "intent": body.get("intent"),
            "meta": body.get("meta", {}),
        }
