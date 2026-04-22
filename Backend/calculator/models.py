from django.db import models
from django.contrib.auth.models import User


class CalculationSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="calculation_sessions")
    instrument_key = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    horizon_days = models.PositiveIntegerField()
    result = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.instrument_key} ({self.horizon_days}d)"
