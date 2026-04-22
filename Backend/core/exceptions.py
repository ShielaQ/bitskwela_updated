from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {
                "success": False,
                "message": "Internal server error",
                "data": None,
                "error": {"detail": "Unhandled exception"},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    detail = response.data
    message = "Request failed"

    if isinstance(detail, dict) and "detail" in detail:
        message = str(detail["detail"])

    response.data = {
        "success": False,
        "message": message,
        "data": None,
        "error": detail,
    }
    return response

