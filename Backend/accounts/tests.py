import uuid
from unittest.mock import patch

from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from rest_framework import exceptions
from rest_framework.test import APIRequestFactory

from accounts.authentication import SupabaseJWTAuthentication
from accounts.models import UserProfile


class SupabaseJWTAuthenticationTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.auth = SupabaseJWTAuthentication()

    def test_rejects_invalid_authorization_header_format(self):
        request = self.factory.get("/api/v1/auth/me/", HTTP_AUTHORIZATION="Token abc")
        with self.assertRaises(exceptions.AuthenticationFailed):
            self.auth.authenticate(request)

    @patch.object(SupabaseJWTAuthentication, "_decode_jwt", return_value={})
    def test_rejects_token_missing_subject(self, _decode):
        request = self.factory.get("/api/v1/auth/me/", HTTP_AUTHORIZATION="Bearer token")
        with self.assertRaises(exceptions.AuthenticationFailed):
            self.auth.authenticate(request)

    @patch.object(SupabaseJWTAuthentication, "_decode_jwt", return_value={"sub": "not-a-uuid"})
    def test_rejects_invalid_subject_format(self, _decode):
        request = self.factory.get("/api/v1/auth/me/", HTTP_AUTHORIZATION="Bearer token")
        with self.assertRaises(exceptions.AuthenticationFailed):
            self.auth.authenticate(request)

    @patch.object(SupabaseJWTAuthentication, "_decode_jwt")
    def test_authenticates_and_creates_local_user_profile(self, decode_mock):
        supabase_user_id = str(uuid.uuid4())
        decode_mock.return_value = {"sub": supabase_user_id, "email": "module9-auth@test.local"}
        request = self.factory.get("/api/v1/auth/me/", HTTP_AUTHORIZATION="Bearer token")
        request.user = AnonymousUser()

        user, _ = self.auth.authenticate(request)

        self.assertEqual(user.email, "module9-auth@test.local")
        profile = UserProfile.objects.get(user=user)
        self.assertEqual(str(profile.supabase_user_id), supabase_user_id)
