import os

from django.core.cache import cache
from django.db import connection
from rest_framework.decorators import api_view

from .responses import error_response, success_response


@api_view(["GET"])
def api_root(request):
    data = {
        "version": "v1",
        "endpoints": {
            "health": "/api/v1/health/",
        },
    }
    return success_response(data=data, message="API root")


@api_view(["GET"])
def health_check(request):
    data = {
        "status": "ok",
        "service": "calc_be",
        "environment": os.getenv("DJANGO_ENV", "dev"),
    }
    return success_response(data=data, message="Service healthy")


@api_view(["GET"])
def readiness_check(request):
    db_ok = False
    cache_ok = False
    db_error = None
    cache_error = None

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        db_ok = True
    except Exception as exc:
        db_error = str(exc)

    try:
        cache.set("readiness:probe", "ok", timeout=10)
        cache_ok = cache.get("readiness:probe") == "ok"
        if not cache_ok:
            cache_error = "Cache probe returned unexpected value"
    except Exception as exc:
        cache_error = str(exc)

    if db_ok and cache_ok:
        return success_response(
            data={"status": "ready", "db": "ok", "cache": "ok"},
            message="Service ready",
        )

    return error_response(
        message="Service not ready",
        status_code=503,
        error_code="SERVICE_NOT_READY",
        error={
            "db": {"ok": db_ok, "error": db_error},
            "cache": {"ok": cache_ok, "error": cache_error},
        },
    )
