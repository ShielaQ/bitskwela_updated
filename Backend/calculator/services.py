from decimal import Decimal

from ai.services import ForecastServiceError, forecast_crypto_return

from .constants import CRYPTO_BASELINE_RETURNS, MODE_MULTIPLIERS, TRADITIONAL_INSTRUMENTS


def list_traditional_instruments():
    return TRADITIONAL_INSTRUMENTS


def get_traditional_rate(instrument_key):
    for item in TRADITIONAL_INSTRUMENTS:
        if item["key"] == instrument_key:
            return Decimal(str(item["annual_return"])), item
    return None, None


def get_crypto_baseline_rate(instrument_key):
    return Decimal(str(CRYPTO_BASELINE_RETURNS.get(instrument_key, 0.60)))


def build_chart_data(principal, annual_return, days, mode_multiplier):
    effective = annual_return * mode_multiplier
    points = min(days, 60)
    result = []
    for i in range(points + 1):
        d = round((days / points) * i) if points else 0
        value = principal * (Decimal("1") + effective / Decimal("365")) ** Decimal(d)
        lower = principal * (Decimal("1") + (effective * Decimal("0.5")) / Decimal("365")) ** Decimal(d)
        upper = principal * (Decimal("1") + (effective * Decimal("1.6")) / Decimal("365")) ** Decimal(d)

        if d < 30:
            label = f"D{d}"
        elif d < 365:
            label = f"{round(d / 30)}mo"
        else:
            label = f"{(d / 365):.1f}yr"

        result.append(
            {
                "label": label,
                "value": float(round(value, 2)),
                "lower": float(round(lower, 2)),
                "upper": float(round(upper, 2)),
            }
        )
    return result


def calculate_projection(*, instrument_type, instrument_key, amount, horizon_days, mode, annual_rate_override=None):
    principal = Decimal(str(amount))
    days = int(horizon_days)
    mode_multiplier = Decimal(str(MODE_MULTIPLIERS.get(mode, 1.0)))

    degraded = False
    degradation_reason = None
    forecast_meta = None
    llm_info = None

    if annual_rate_override is not None:
        annual_return = Decimal(str(annual_rate_override))
        source = "override"
        instrument_meta = None
    elif instrument_type == "traditional":
        annual_return, instrument_meta = get_traditional_rate(instrument_key)
        if annual_return is None:
            raise ValueError("Unknown traditional instrument")
        source = "traditional_baseline"
    else:
        baseline = get_crypto_baseline_rate(instrument_key)
        try:
            forecast_data = forecast_crypto_return(
                instrument_key=instrument_key,
                amount=principal,
                horizon_days=days,
                mode=mode,
            )
            annual_return = Decimal(str(forecast_data["annual_return"]))
            source = "forecast_service"
            forecast_meta = {
                "confidence": forecast_data.get("forecast_confidence"),
                "provider_meta": forecast_data.get("forecast_meta", {}),
                "llm_warning": forecast_data.get("llm_warning"),
            }
            llm_info = forecast_data.get("llm_info")
        except ForecastServiceError as exc:
            annual_return = baseline
            source = "crypto_baseline_degraded"
            degraded = True
            degradation_reason = str(exc)
        instrument_meta = None

    effective = annual_return * (mode_multiplier if instrument_type == "crypto" else Decimal("1.0"))
    projected = principal * (Decimal("1") + effective / Decimal("365")) ** Decimal(days)
    profit = projected - principal
    pct = (profit / principal) * Decimal("100")
    chart_data = build_chart_data(principal, annual_return, days, mode_multiplier)

    return {
        "instrument_type": instrument_type,
        "instrument_key": instrument_key,
        "horizon_days": days,
        "mode": mode,
        "source": source,
        "annual_return": float(round(annual_return, 6)),
        "effective_return": float(round(effective, 6)),
        "projected_value": float(round(projected, 2)),
        "profit": float(round(profit, 2)),
        "pct": float(round(pct, 4)),
        "chart_data": chart_data,
        "instrument_meta": instrument_meta,
        "degraded": degraded,
        "degradation_reason": degradation_reason,
        "forecast_meta": forecast_meta,
        "llm_info": llm_info,
    }
