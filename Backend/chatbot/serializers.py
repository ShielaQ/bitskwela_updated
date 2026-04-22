from rest_framework import serializers


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=5000)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)
    context = serializers.JSONField(required=False)


class ChatHistoryQuerySerializer(serializers.Serializer):
    conversation_id = serializers.IntegerField(required=False)
    limit = serializers.IntegerField(required=False, min_value=1, max_value=200, default=50)

