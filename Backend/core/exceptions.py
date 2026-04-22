from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


STATUS_ERROR_CODES = {
    status.HTTP_400_BAD_REQUEST: "BAD_REQUEST",
    status.HTTP_401_UNAUTHORIZED: "UNAUTHORIZED",
    status.HTTP_403_FORBIDDEN: "FORBIDDEN",
    status.HTTP_404_NOT_FOUND: "NOT_FOUND",
    status.HTTP_405_METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
    status.HTTP_429_TOO_MANY_REQUESTS: "RATE_LIMITED",
    status.HTTP_500_INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    status.HTTP_502_BAD_GATEWAY: "UPSTREAM_ERROR",
    status.HTTP_503_SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
}


def _error_code_for_status(status_code):
    return STATUS_ERROR_CODES.get(status_code, f"HTTP_{status_code}")


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Response(
            {
                "success": False,
                "message": "Internal server error",
                "data": None,
                "error": {
                    "code": _error_code_for_status(status_code),
                    "details": {"detail": "Unhandled exception"},
                },
            },
            status=status_code,
        )

    detail = response.data
    message = "Request failed"

    if isinstance(detail, dict) and "detail" in detail:
        message = str(detail["detail"])

    response.data = {
        "success": False,
        "message": message,
        "data": None,
        "error": {
            "code": _error_code_for_status(response.status_code),
            "details": detail,
        },
    }
    return response
