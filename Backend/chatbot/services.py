from ai.llm_client import LLMClient, LLMServiceError

from .context_builder import build_chat_prompt_context


def classify_intent(message: str) -> str:
    lower = message.lower()
    if any(k in lower for k in ["calculator", "projection", "rate", "return", "pag-ibig", "mp2", "tbill", "rtb"]):
        return "calculator_assistance"
    if any(k in lower for k in ["where", "how to use", "module", "navigate", "learn", "start"]):
        return "platform_navigation"
    if any(k in lower for k in ["bitcoin", "blockchain", "wallet", "defi", "gas", "mempool", "smart contract"]):
        return "learning_assistance"
    return "general"


def llm_first_chat_reply(*, message: str, context: dict | None):
    intent = classify_intent(message)
    client = LLMClient()

    prompt_payload = build_chat_prompt_context(
        message=message,
        intent=intent,
        context=context or {},
    )

    if not client.available():
        return {
            "intent": intent,
            "reply": "The AI assistant is temporarily unavailable. Please try again shortly.",
            "degraded": True,
            "degradation_reason": client.unavailable_reason(),
            "provider_meta": {
                "prompt_context_enabled": True,
                "socratic_mode": True,
            },
        }

    try:
        result = client.chat_response(
            {
                "message": message,
                "intent": intent,
                "context": prompt_payload["context"],
                "system": prompt_payload["system"],
            }
        )
        provider_meta = result.get("meta", {})
        provider_meta["prompt_context_enabled"] = True
        provider_meta["socratic_mode"] = True
        return {
            "intent": result.get("intent") or intent,
            "reply": result["reply"],
            "degraded": False,
            "degradation_reason": None,
            "provider_meta": provider_meta,
        }
    except LLMServiceError as exc:
        return {
            "intent": intent,
            "reply": "The AI assistant is temporarily unavailable. Please try again shortly.",
            "degraded": True,
            "degradation_reason": str(exc),
            "provider_meta": {
                "prompt_context_enabled": True,
                "socratic_mode": True,
            },
        }
