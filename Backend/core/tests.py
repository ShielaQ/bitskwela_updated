from rest_framework.test import APITestCase


class CoreHardeningTests(APITestCase):
    def test_health_and_readiness_endpoints(self):
        health = self.client.get("/api/v1/health/")
        self.assertEqual(health.status_code, 200)
        self.assertTrue(health.data["success"])

        ready = self.client.get("/api/v1/ready/")
        self.assertEqual(ready.status_code, 200)
        self.assertTrue(ready.data["success"])
        self.assertEqual(ready.data["data"]["status"], "ready")

    def test_error_response_contains_standard_code(self):
        response = self.client.post(
            "/api/v1/calculate/",
            {
                "instrument_type": "traditional",
                "instrument_key": "pagibig_mp2",
                "amount": 1000,
                "horizon_days": 30,
                "mode": "moderate",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["error"]["code"], "UNAUTHORIZED")

    def test_chat_endpoint_has_throttle_class(self):
        from chatbot.views import chat
        from core.throttles import ChatRateThrottle

        self.assertIn(ChatRateThrottle, chat.cls.throttle_classes)
