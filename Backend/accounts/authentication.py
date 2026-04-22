import os
import uuid

import jwt
from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions

from .models import UserProfile


class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    _jwk_client = None

    def authenticate_header(self, request):
        return "Bearer"

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode("utf-8")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise exceptions.AuthenticationFailed("Invalid authorization header format")

        token = parts[1]
        payload = self._decode_jwt(token)
        supabase_sub = payload.get("sub")
        if not supabase_sub:
            raise exceptions.AuthenticationFailed("Token missing subject")

        try:
            supabase_user_id = uuid.UUID(str(supabase_sub))
        except ValueError as exc:
            raise exceptions.AuthenticationFailed("Invalid token subject") from exc

        user = self._get_or_create_user(payload, supabase_user_id)
        return (user, None)

    @classmethod
    def _get_jwk_client(cls):
        if cls._jwk_client is not None:
            return cls._jwk_client

        project_url = os.getenv("SUPABASE_PROJECT_URL", "").rstrip("/")
        jwks_url = os.getenv("SUPABASE_JWKS_URL", "")
        if not jwks_url and project_url:
            jwks_url = f"{project_url}/auth/v1/.well-known/jwks.json"
        if not jwks_url:
            raise exceptions.AuthenticationFailed("SUPABASE_JWKS_URL or SUPABASE_PROJECT_URL is required")

        cls._jwk_client = jwt.PyJWKClient(jwks_url)
        return cls._jwk_client

    def _decode_jwt(self, token):
        try:
            jwk_client = self._get_jwk_client()
            signing_key = jwk_client.get_signing_key_from_jwt(token)
            issuer = os.getenv("SUPABASE_JWT_ISSUER", "").strip()
            if not issuer:
                project_url = os.getenv("SUPABASE_PROJECT_URL", "").rstrip("/")
                if project_url:
                    issuer = f"{project_url}/auth/v1"

            options = {"verify_aud": bool(os.getenv("SUPABASE_JWT_AUDIENCE", "").strip())}
            kwargs = {
                "algorithms": [os.getenv("SUPABASE_JWT_ALGORITHM", "RS256")],
                "options": options,
            }

            audience = os.getenv("SUPABASE_JWT_AUDIENCE", "").strip()
            if audience:
                kwargs["audience"] = audience
            if issuer:
                kwargs["issuer"] = issuer

            return jwt.decode(token, signing_key.key, **kwargs)
        except jwt.PyJWTError as exc:
            raise exceptions.AuthenticationFailed("Invalid or expired token") from exc

    def _get_or_create_user(self, payload, supabase_user_id):
        email = payload.get("email", "")
        username_seed = str(supabase_user_id).replace("-", "")
        username = f"sb_{username_seed[:24]}"

        profile = UserProfile.objects.filter(supabase_user_id=supabase_user_id).select_related("user").first()
        if profile:
            if email and profile.email != email:
                profile.email = email
                profile.save(update_fields=["email", "updated_at"])
            return profile.user

        user, _ = User.objects.get_or_create(
            username=username,
            defaults={"email": email},
        )
        if email and user.email != email:
            user.email = email
            user.save(update_fields=["email"])

        UserProfile.objects.create(
            user=user,
            supabase_user_id=supabase_user_id,
            email=email,
        )
        return user
