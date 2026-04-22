from django.urls import path

from .views import event_report, ingest_event, metrics

urlpatterns = [
    path("events/", ingest_event, name="analytics-events"),
    path("metrics/", metrics, name="analytics-metrics"),
    path("reports/events/", event_report, name="analytics-event-report"),
]
