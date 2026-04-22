from django.urls import path

from .views import current_user

urlpatterns = [
    # Temporary validation endpoint for Module 2.
    # Remove after Supabase JWT auth is stable and validated end-to-end.
    path("me/", current_user, name="auth-me"),
]

