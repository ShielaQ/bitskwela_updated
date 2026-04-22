from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from core.responses import success_response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    profile = getattr(request.user, "profile", None)
    data = {
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "supabase_user_id": str(profile.supabase_user_id) if profile else None,
    }
    return success_response(data=data, message="Authenticated user")
