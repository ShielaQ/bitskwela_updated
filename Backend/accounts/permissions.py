from rest_framework.permissions import BasePermission


class IsOwnerResource(BasePermission):
    """
    Checks common ownership patterns: obj.user or obj.profile.user.
    """

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "user"):
            return obj.user == request.user
        if hasattr(obj, "profile") and hasattr(obj.profile, "user"):
            return obj.profile.user == request.user
        return False

