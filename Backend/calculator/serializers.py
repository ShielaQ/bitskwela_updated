from decimal import Decimal

from rest_framework import serializers

from .constants import INSTRUMENT_ALIASES


class CalculateSerializer(serializers.Serializer):
    instrument_type = serializers.ChoiceField(choices=["crypto", "traditional"])
    instrument_key = serializers.CharField(max_length=120)
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, min_value=Decimal("1.00"))
    horizon_days = serializers.IntegerField(min_value=1, max_value=3650)
    mode = serializers.ChoiceField(
        choices=["conservative", "moderate", "aggressive"],
        required=False,
        default="moderate",
    )
    annual_rate_override = serializers.DecimalField(
        max_digits=10,
        decimal_places=6,
        required=False,
        allow_null=True,
    )

    def validate(self, attrs):
        instrument_type = attrs["instrument_type"]
        instrument_key = attrs["instrument_key"]
        aliases = INSTRUMENT_ALIASES.get(instrument_type, {})
        attrs["instrument_key"] = aliases.get(instrument_key, instrument_key)
        return attrs
