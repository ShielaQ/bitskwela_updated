import os

from rest_framework.decorators import api_view

from .responses import success_response


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
