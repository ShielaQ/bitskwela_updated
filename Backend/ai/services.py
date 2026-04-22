import hashlib
import json
import os
from decimal import Decimal

from django.core.cache import cache

from .forecast_client import ForecastClient, ForecastServiceError
from .llm_client import LLMClient, LLMServiceError


def forecast_crypto_return(*, instrument_key, amount, horizon_days, mode):
    forecast_client = ForecastClient()
    llm_client = LLMClient()

    payload = {
        "instrument_key": instrument_key,
        "amount": float(amount),
        "horizon_days": int(horizon_days),
        "mode": mode,
    }

    cache_ttl = int(os.getenv("FORECAST_CACHE_TTL_SECONDS", "300"))
    payload_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
    cache_key = f"forecast:{payload_hash}"
    forecast_data = cache.get(cache_key)
    if forecast_data is None:
        forecast_data = forecast_client.forecast(payload)
        cache.set(cache_key, forecast_data, timeout=cache_ttl)

    annual_return = Decimal(str(forecast_data["annual_return"]))

    llm_info = None
    llm_warning = None
    if llm_client.available():
        try:
            llm_info = llm_client.interpret_forecast(
                {
                    "instrument_key": instrument_key,
                    "forecast": forecast_data,
                    "horizon_days": int(horizon_days),
                    "mode": mode,
                }
            )
        except LLMServiceError as exc:
            llm_warning = str(exc)

    return {
        "annual_return": annual_return,
        "forecast_confidence": forecast_data.get("confidence"),
        "forecast_meta": forecast_data.get("provider_meta", {}),
        "llm_info": llm_info,
        "llm_warning": llm_warning,
    }


__all__ = ["ForecastServiceError", "forecast_crypto_return"]
