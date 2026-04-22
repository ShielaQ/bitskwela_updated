from django.urls import path

from .views import api_root, health_check, readiness_check

urlpatterns = [
    path("", api_root, name="api-root"),
    path("health/", health_check, name="health-check"),
    path("ready/", readiness_check, name="readiness-check"),
]
