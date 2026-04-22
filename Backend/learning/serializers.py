from rest_framework import serializers

from .constants import LEARNING_MODULES


class ModuleProgressUpsertSerializer(serializers.Serializer):
    module_key = serializers.CharField(max_length=100)
    step_index = serializers.IntegerField(min_value=0)
    completed = serializers.BooleanField(required=False)
    metadata = serializers.JSONField(required=False)

    def validate_module_key(self, value):
        if value not in LEARNING_MODULES:
            raise serializers.ValidationError("Unsupported module_key")
        return value


class ModuleCompletionSerializer(serializers.Serializer):
    module_key = serializers.CharField(max_length=100)
    step_index = serializers.IntegerField(min_value=0, required=False)
    metadata = serializers.JSONField(required=False)

    def validate_module_key(self, value):
        if value not in LEARNING_MODULES:
            raise serializers.ValidationError("Unsupported module_key")
        return value


class ModuleProgressQuerySerializer(serializers.Serializer):
    module_key = serializers.CharField(max_length=100, required=False)

    def validate_module_key(self, value):
        if value not in LEARNING_MODULES:
            raise serializers.ValidationError("Unsupported module_key")
        return value

