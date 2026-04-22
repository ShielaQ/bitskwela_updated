from collections import Counter
from decimal import Decimal, InvalidOperation

from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.responses import error_response, success_response

from .models import AnalyticsEvent
from .serializers import AnalyticsEventIngestSerializer, AnalyticsMetricsQuerySerializer

CALCULATOR_EVENT_TYPES = {"calculation_completed", "calculator_used"}
MODULE_EVENT_TYPES = {"module_started", "module_completed", "learning_module_started", "learning_module_completed"}


def _to_decimal(value):
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return None


def _get_filtered_queryset(validated_data):
    start = validated_data.get("start")
    end = validated_data.get("end")
    queryset = AnalyticsEvent.objects.all()
    if start:
        queryset = queryset.filter(created_at__gte=start)
    if end:
        queryset = queryset.filter(created_at__lte=end)
    return queryset, start, end


@api_view(["POST"])
@permission_classes([AllowAny])
def ingest_event(request):
    serializer = AnalyticsEventIngestSerializer(data=request.data)
    if not serializer.is_valid():
        return error_response(
            message="Invalid analytics event payload",
            error=serializer.errors,
            status_code=400,
        )

    payload = serializer.validated_data
    raw_session_key = payload.get("session_key")
    session_key = raw_session_key.strip() if isinstance(raw_session_key, str) else raw_session_key
    event = AnalyticsEvent.objects.create(
        user=request.user if request.user.is_authenticated else None,
        event_type=payload["event_type"],
        source=payload["source"],
        session_key=session_key,
        payload=payload.get("payload", {}),
    )

    return success_response(
        data={
            "id": event.id,
            "event_type": event.event_type,
            "source": event.source,
            "session_key": event.session_key,
            "created_at": event.created_at.isoformat(),
        },
        message="Analytics event ingested",
        status_code=201,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def metrics(request):
    serializer = AnalyticsMetricsQuerySerializer(data=request.query_params)
    if not serializer.is_valid():
        return error_response(
            message="Invalid metrics query",
            error=serializer.errors,
            status_code=400,
        )

    queryset, start, end = _get_filtered_queryset(serializer.validated_data)

    events = list(queryset.values("id", "event_type", "payload", "user_id", "session_key", "created_at"))
    asset_counter = Counter()
    amount_total = Decimal("0")
    amount_count = 0
    calculator_users = set()
    module_users = set()

    for event in events:
        event_type = event["event_type"]
        payload = event["payload"] or {}
        user_id = event["user_id"]
        session_key = event["session_key"]

        instrument_key = payload.get("instrument_key") or payload.get("asset_key")
        if instrument_key and event_type in {"calculation_completed", "simulation_started", "calculator_used"}:
            asset_counter[str(instrument_key)] += 1

        if event_type in CALCULATOR_EVENT_TYPES:
            amount = _to_decimal(payload.get("amount"))
            if amount is not None:
                amount_total += amount
                amount_count += 1
            if user_id:
                calculator_users.add(user_id)

        if event_type in MODULE_EVENT_TYPES and user_id:
            module_users.add(user_id)

        # Optional fallback attribution for anonymous usage where session is available.
        if event_type in CALCULATOR_EVENT_TYPES and not user_id and session_key:
            calculator_users.add(f"session:{session_key}")
        if event_type in MODULE_EVENT_TYPES and not user_id and session_key:
            module_users.add(f"session:{session_key}")

    converted_users = calculator_users.intersection(module_users)
    conversion_rate = float(len(converted_users) / len(calculator_users)) if calculator_users else 0.0
    average_amount = float(amount_total / amount_count) if amount_count else 0.0

    most_simulated_assets = [
        {"instrument_key": key, "count": count}
        for key, count in asset_counter.most_common(10)
    ]

    return success_response(
        data={
            "filters": {
                "start": start.isoformat() if start else None,
                "end": end.isoformat() if end else None,
            },
            "total_events": len(events),
            "attributed_events": sum(1 for event in events if event["user_id"] or event["session_key"]),
            "most_simulated_assets": most_simulated_assets,
            "average_simulation_amount": average_amount,
            "calculator_to_module_conversion": {
                "calculator_users": len(calculator_users),
                "module_users": len(module_users),
                "converted_users": len(converted_users),
                "conversion_rate": conversion_rate,
            },
        },
        message="Analytics metrics fetched",
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def event_report(request):
    serializer = AnalyticsMetricsQuerySerializer(data=request.query_params)
    if not serializer.is_valid():
        return error_response(
            message="Invalid report query",
            error=serializer.errors,
            status_code=400,
        )

    queryset, start, end = _get_filtered_queryset(serializer.validated_data)

    by_type = list(
        queryset.values("event_type")
        .annotate(count=Count("id"))
        .order_by("-count", "event_type")
    )
    by_source = list(
        queryset.values("source")
        .annotate(count=Count("id"))
        .order_by("-count", "source")
    )
    recent_items = list(
        queryset.order_by("-created_at")
        .values("id", "event_type", "source", "user_id", "session_key", "created_at")[:50]
    )

    return success_response(
        data={
            "filters": {
                "start": start.isoformat() if start else None,
                "end": end.isoformat() if end else None,
            },
            "events_by_type": by_type,
            "events_by_source": by_source,
            "recent_events": [
                {
                    **item,
                    "created_at": item["created_at"].isoformat(),
                }
                for item in recent_items
            ],
        },
        message="Analytics report fetched",
    )
