from requests import RequestException
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.responses import error_response, success_response
from core.throttles import CalculateRateThrottle

from .coingecko import CoinGeckoClient
from .models import CalculationSession
from .serializers import CalculateSerializer
from .services import calculate_projection, list_traditional_instruments


@api_view(["GET"])
@permission_classes([AllowAny])
def investments(request):
    return success_response(
        data={
            "crypto": {
                "source": "CoinGecko",
                "endpoint": "/api/v1/investments/crypto/",
                "note": "Dynamic market-cap sorted list from CoinGecko.",
            },
            "traditional": list_traditional_instruments(),
        },
        message="Investment instruments fetched",
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def rates(request):
    return success_response(
        data={
            "traditional_rates": list_traditional_instruments(),
            "note": "PH traditional rates are baseline/manual-update values for now.",
        },
        message="Traditional rates fetched",
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def crypto_instruments(request):
    vs_currency = request.query_params.get("vs_currency", "php").lower()
    page = int(request.query_params.get("page", 1))
    per_page = int(request.query_params.get("per_page", 20))
    per_page = max(1, min(per_page, 100))

    try:
        client = CoinGeckoClient()
        items = client.get_top_coins(vs_currency=vs_currency, per_page=per_page, page=page)
        return success_response(
            data={
                "provider": "coingecko",
                "vs_currency": vs_currency,
                "page": page,
                "per_page": per_page,
                "items": items,
            },
            message="Crypto instruments fetched",
        )
    except RequestException as exc:
        return error_response(
            message="Failed to fetch CoinGecko data",
            error={"detail": str(exc)},
            status_code=502,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@throttle_classes([CalculateRateThrottle])
def calculate(request):
    serializer = CalculateSerializer(data=request.data)
    if not serializer.is_valid():
        return error_response(
            message="Invalid calculator payload",
            error=serializer.errors,
            status_code=400,
        )

    payload = serializer.validated_data
    try:
        result = calculate_projection(
            instrument_type=payload["instrument_type"],
            instrument_key=payload["instrument_key"],
            amount=payload["amount"],
            horizon_days=payload["horizon_days"],
            mode=payload.get("mode", "moderate"),
            annual_rate_override=payload.get("annual_rate_override"),
        )
    except ValueError as exc:
        return error_response(
            message="Calculation failed",
            error={"detail": str(exc)},
            status_code=400,
        )

    session = CalculationSession.objects.create(
        user=request.user,
        instrument_key=payload["instrument_key"],
        amount=payload["amount"],
        horizon_days=payload["horizon_days"],
        result=result,
    )

    result["session_id"] = session.id
    return success_response(data=result, message="Projection calculated", status_code=201)
