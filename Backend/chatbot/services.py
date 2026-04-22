from ai.llm_client import LLMClient, LLMServiceError


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

    if not client.available():
        return {
            "intent": intent,
            "reply": "The AI assistant is temporarily unavailable. Please try again shortly.",
            "degraded": True,
            "degradation_reason": "LLM service URL is not configured",
            "provider_meta": {},
        }

    try:
        result = client.chat_response(
            {
                "message": message,
                "intent": intent,
                "context": context or {},
                "system": "You are Bitskwela's backend chatbot. Be concise, practical, and user-safe.",
            }
        )
        return {
            "intent": result.get("intent") or intent,
            "reply": result["reply"],
            "degraded": False,
            "degradation_reason": None,
            "provider_meta": result.get("meta", {}),
        }
    except LLMServiceError as exc:
        return {
            "intent": intent,
            "reply": "The AI assistant is temporarily unavailable. Please try again shortly.",
            "degraded": True,
            "degradation_reason": str(exc),
            "provider_meta": {},
        }

