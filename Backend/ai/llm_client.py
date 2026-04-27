import os

import requests


class LLMServiceError(Exception):
    pass


class LLMClient:
    def __init__(self):
        configured_provider = os.getenv("AI_LLM_PROVIDER", "").strip().lower()
        self.base_url = os.getenv("AI_LLM_SERVICE_URL", "").rstrip("/")
        self.endpoint = os.getenv("AI_LLM_ENDPOINT", "/interpret")
        self.chat_endpoint = os.getenv("AI_LLM_CHAT_ENDPOINT", "/chat")
        self.timeout = int(os.getenv("AI_LLM_TIMEOUT_SECONDS", "20"))
        self.api_key = os.getenv("AI_LLM_API_KEY", "").strip()
        self.api_key_header = os.getenv("AI_LLM_API_KEY_HEADER", "Authorization").strip()
        self.gemini_api_key = (
            os.getenv("AI_GEMINI_API_KEY", "").strip()
            or os.getenv("GEMINI_API_KEY", "").strip()
            or os.getenv("GOOGLE_API_KEY", "").strip()
        )
        self.gemini_model = (
            os.getenv("AI_GEMINI_MODEL", "").strip()
            or os.getenv("GEMINI_MODEL", "").strip()
            or "gemini-1.5-flash-002"
        )
        self.gemini_base_url = (
            os.getenv("AI_GEMINI_BASE_URL", "").rstrip("/")
            or os.getenv("GEMINI_BASE_URL", "").rstrip("/")
            or "https://generativelanguage.googleapis.com/v1beta"
        )
        if configured_provider:
            self.provider = configured_provider
        elif self.gemini_api_key and not self.base_url:
            self.provider = "gemini"
        else:
            self.provider = "service"

    def available(self):
        if self.provider == "gemini":
            return bool(self.gemini_api_key)
        return bool(self.base_url)

    def unavailable_reason(self):
        if self.provider == "gemini":
            return "Gemini API key is not configured"
        return "LLM service URL is not configured"

    def _headers(self):
        headers = {"accept": "application/json", "content-type": "application/json"}
        if self.api_key:
            if self.api_key_header.lower() == "authorization":
                headers[self.api_key_header] = f"Bearer {self.api_key}"
            else:
                headers[self.api_key_header] = self.api_key
        return headers

    def _gemini_generate_text(self, prompt):
        if not self.available():
            raise LLMServiceError(self.unavailable_reason())

        candidate_models = []
        if self.gemini_model:
            candidate_models.append(self.gemini_model)
        candidate_models.extend(
            [
                "gemini-3-flash-preview",
                "gemini-3.1-flash-lite-preview",
                "gemini-2.5-flash",
                "gemini-2.5-flash-lite",
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
            ]
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
            },
        }
        response = None
        body = None
        last_error = None
        for model in dict.fromkeys(candidate_models):
            url = f"{self.gemini_base_url}/models/{model}:generateContent?key={self.gemini_api_key}"
            try:
                response = requests.post(
                    url,
                    json=payload,
                    headers={"accept": "application/json", "content-type": "application/json"},
                    timeout=self.timeout,
                )
                if response.status_code == 404:
                    last_error = f"Model {model} not found"
                    continue
                response.raise_for_status()
                body = response.json()
                self.gemini_model = model
                break
            except requests.RequestException as exc:
                last_error = str(exc)
                break
            except ValueError as exc:
                raise LLMServiceError("Gemini returned non-JSON response") from exc

        if body is None:
            error_message = last_error or "Gemini request failed"
            raise LLMServiceError(f"Gemini request failed: {error_message}")

        candidates = body.get("candidates") or []
        parts = []
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
        text = "".join(part.get("text", "") for part in parts if isinstance(part, dict)).strip()
        if not text:
            raise LLMServiceError("Gemini response missing text output")
        return text

    def interpret_forecast(self, payload):
        if not self.available():
            raise LLMServiceError(self.unavailable_reason())

        if self.provider == "gemini":
            summary = self._gemini_generate_text(
                "You are a concise financial education assistant. "
                "Summarize this forecast for a beginner in 2-3 sentences with neutral, non-guaranteed language.\n"
                f"Forecast payload: {payload}"
            )
            return {
                "summary": summary,
                "confidence_adjustment": None,
                "provider_meta": {"provider": "gemini", "model": self.gemini_model},
            }

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
            raise LLMServiceError(self.unavailable_reason())

        if self.provider == "gemini":
            prompt = (
                f"{payload.get('system', '')}\n\n"
                "User message:\n"
                f"{payload.get('message', '')}\n\n"
                "Conversation context (JSON):\n"
                f"{payload.get('context', {})}\n\n"
                "Return only the assistant reply text."
            )
            reply = self._gemini_generate_text(prompt)
            return {
                "reply": reply,
                "intent": payload.get("intent"),
                "meta": {"provider": "gemini", "model": self.gemini_model},
            }

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
