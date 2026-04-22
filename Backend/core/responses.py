from rest_framework.response import Response


def success_response(data=None, message="OK", status_code=200):
    payload = {
        "success": True,
        "message": message,
        "data": data,
        "error": None,
    }
    return Response(payload, status=status_code)


def error_response(message="Request failed", error=None, status_code=400):
    payload = {
        "success": False,
        "message": message,
        "data": None,
        "error": error,
    }
    return Response(payload, status=status_code)

