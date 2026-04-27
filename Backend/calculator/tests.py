import uuid
from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import UserProfile
from ai.services import ForecastServiceError
from calculator.models import CalculationSession
from calculator.serializers import CalculateSerializer
from calculator.services import calculate_projection


class CalculatorServiceTests(APITestCase):
    def test_traditional_projection_is_deterministic(self):
        result = calculate_projection(
            instrument_type="traditional",
            instrument_key="pagibig_mp2",
            amount=Decimal("1000.00"),
            horizon_days=365,
            mode="moderate",
        )

        self.assertEqual(result["source"], "traditional_baseline")
        self.assertEqual(result["instrument_key"], "pagibig_mp2")
        self.assertGreater(result["projected_value"], 1000.0)
        self.assertTrue(len(result["chart_data"]) > 0)

    @patch("calculator.services.forecast_crypto_return", side_effect=ForecastServiceError("forecast unavailable"))
    def test_crypto_projection_falls_back_to_baseline_on_forecast_failure(self, _forecast_mock):
        result = calculate_projection(
            instrument_type="crypto",
            instrument_key="bitcoin",
            amount=Decimal("1000.00"),
            horizon_days=30,
            mode="moderate",
        )

        self.assertEqual(result["source"], "crypto_baseline_degraded")
        self.assertTrue(result["degraded"])
        self.assertIn("forecast unavailable", result["degradation_reason"])


class CalculatorSerializerTests(APITestCase):
    def test_calculate_serializer_rejects_invalid_payload(self):
        serializer = CalculateSerializer(
            data={
                "instrument_type": "crypto",
                "instrument_key": "bitcoin",
                "amount": "0",
                "horizon_days": 0,
                "mode": "invalid-mode",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)
        self.assertIn("horizon_days", serializer.errors)
        self.assertIn("mode", serializer.errors)


class CalculatorAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="calc_user", password="x")
        UserProfile.objects.create(
            user=self.user,
            supabase_user_id=uuid.uuid4(),
            email="calc_user@test.local",
        )

    def test_calculate_requires_authentication(self):
        response = self.client.post(
            reverse("calculate"),
            {
                "instrument_type": "traditional",
                "instrument_key": "pagibig_mp2",
                "amount": "1000.00",
                "horizon_days": 30,
                "mode": "moderate",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 401)

    def test_calculate_returns_contract_and_persists_session(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("calculate"),
            {
                "instrument_type": "traditional",
                "instrument_key": "pagibig_mp2",
                "amount": "1000.00",
                "horizon_days": 30,
                "mode": "moderate",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["message"], "Projection calculated")
        self.assertIsNone(response.data["error"])
        self.assertIn("session_id", response.data["data"])
        self.assertEqual(CalculationSession.objects.filter(user=self.user).count(), 1)
