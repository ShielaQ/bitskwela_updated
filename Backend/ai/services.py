from decimal import Decimal

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

    forecast_data = forecast_client.forecast(payload)
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

