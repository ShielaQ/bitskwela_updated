from django.db import models
from django.contrib.auth.models import User


class AnalyticsEvent(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="analytics_events"
    )
    event_type = models.CharField(max_length=100)
    source = models.CharField(max_length=50, default="frontend")
    session_key = models.CharField(max_length=120, null=True, blank=True, db_index=True)
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} ({self.source})"
