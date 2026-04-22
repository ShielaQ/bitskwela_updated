from rest_framework import serializers


class AnalyticsEventIngestSerializer(serializers.Serializer):
    event_type = serializers.CharField(max_length=100)
    source = serializers.CharField(max_length=50, required=False, default="frontend")
    session_key = serializers.CharField(max_length=120, required=False, allow_blank=True, allow_null=True)
    payload = serializers.JSONField(required=False, default=dict)


class AnalyticsMetricsQuerySerializer(serializers.Serializer):
    start = serializers.DateTimeField(required=False)
    end = serializers.DateTimeField(required=False)

    def validate(self, attrs):
        start = attrs.get("start")
        end = attrs.get("end")
        if start and end and start > end:
            raise serializers.ValidationError({"end": ["Must be greater than or equal to start."]})
        return attrs
