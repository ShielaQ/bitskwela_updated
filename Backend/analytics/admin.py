from django.contrib import admin

from .models import AnalyticsEvent


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ("id", "event_type", "source", "session_key", "user", "created_at")
    search_fields = ("event_type", "source", "session_key")
    list_filter = ("source", "event_type", "created_at")
