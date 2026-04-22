import uuid

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import UserProfile
from analytics.models import AnalyticsEvent


class AnalyticsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="analytics_user", password="x")
        UserProfile.objects.create(
            user=self.user,
            supabase_user_id=uuid.uuid4(),
            email="analytics@test.local",
        )

    def test_event_ingestion_allows_anonymous(self):
        response = self.client.post(
            reverse("analytics-events"),
            {
                "event_type": "simulation_started",
                "source": "frontend",
                "session_key": "sess-abc-123",
                "payload": {"instrument_key": "bitcoin"},
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(AnalyticsEvent.objects.count(), 1)
        self.assertIsNone(AnalyticsEvent.objects.first().user)
        self.assertEqual(AnalyticsEvent.objects.first().session_key, "sess-abc-123")

    def test_metrics_returns_aggregates_for_authenticated_user(self):
        self.client.force_authenticate(user=self.user)
        AnalyticsEvent.objects.create(
            user=self.user,
            event_type="calculation_completed",
            source="frontend",
            payload={"instrument_key": "bitcoin", "amount": 1000},
        )
        AnalyticsEvent.objects.create(
            user=self.user,
            event_type="module_started",
            source="frontend",
            payload={"module_key": "financial"},
        )
        AnalyticsEvent.objects.create(
            event_type="simulation_started",
            source="frontend",
            payload={"instrument_key": "bitcoin"},
        )

        response = self.client.get(reverse("analytics-metrics"))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["total_events"], 3)
        self.assertEqual(response.data["data"]["attributed_events"], 2)
        self.assertEqual(response.data["data"]["most_simulated_assets"][0]["instrument_key"], "bitcoin")
        self.assertEqual(response.data["data"]["average_simulation_amount"], 1000.0)
        self.assertEqual(response.data["data"]["calculator_to_module_conversion"]["conversion_rate"], 1.0)

    def test_metrics_requires_authentication(self):
        response = self.client.get(reverse("analytics-metrics"))
        self.assertEqual(response.status_code, 401)

    def test_event_report_returns_internal_breakdown(self):
        self.client.force_authenticate(user=self.user)
        AnalyticsEvent.objects.create(
            user=self.user,
            event_type="calculation_completed",
            source="frontend",
            payload={"amount": 500},
        )
        AnalyticsEvent.objects.create(
            event_type="simulation_started",
            source="backend",
            session_key="anon-xyz",
            payload={"instrument_key": "ethereum"},
        )

        response = self.client.get(reverse("analytics-event-report"))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertGreaterEqual(len(response.data["data"]["events_by_type"]), 1)
        self.assertGreaterEqual(len(response.data["data"]["events_by_source"]), 1)
        self.assertGreaterEqual(len(response.data["data"]["recent_events"]), 1)
