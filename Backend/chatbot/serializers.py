from rest_framework import serializers


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=5000)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)
    context = serializers.JSONField(required=False)

    screen = serializers.CharField(required=False, allow_blank=True, max_length=80)
    module_key = serializers.CharField(required=False, allow_blank=True, max_length=80)
    step_id = serializers.CharField(required=False, allow_blank=True, max_length=120)
    attempt_count = serializers.IntegerField(required=False, min_value=0)
    placements = serializers.JSONField(required=False)


class ChatHistoryQuerySerializer(serializers.Serializer):
    conversation_id = serializers.IntegerField(required=False)
    limit = serializers.IntegerField(required=False, min_value=1, max_value=200, default=50)
