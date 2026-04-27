import uuid

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import UserProfile
from learning.models import ModuleProgress


class LearningProgressAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="learning_user", password="x")
        UserProfile.objects.create(
            user=self.user,
            supabase_user_id=uuid.uuid4(),
            email="learning@test.local",
        )
        self.client.force_authenticate(user=self.user)

    def test_modules_returns_metadata_with_user_progress(self):
        ModuleProgress.objects.create(
            user=self.user,
            module_key="financial",
            step_index=2,
            completed=False,
            metadata={"last_step_id": "buy-sell"},
        )

        response = self.client.get(reverse("learning-modules"))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["count"], 3)
        financial = next(i for i in response.data["data"]["items"] if i["module_key"] == "financial")
        self.assertEqual(financial["progress"]["step_index"], 2)
        advanced = next(i for i in response.data["data"]["items"] if i["module_key"] == "advanced")
        self.assertEqual(advanced["step_count"], 4)
        technical = next(i for i in response.data["data"]["items"] if i["module_key"] == "technical")
        self.assertEqual(technical["step_count"], 6)

    def test_progress_put_upserts_record(self):
        response = self.client.put(
            reverse("learning-progress"),
            {
                "module_key": "technical",
                "step_index": 3,
                "completed": False,
                "metadata": {"last_step_id": "block-building"},
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ModuleProgress.objects.count(), 1)

        response = self.client.put(
            reverse("learning-progress"),
            {
                "module_key": "technical",
                "step_index": 5,
                "completed": True,
                "metadata": {"last_step_id": "consensus"},
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ModuleProgress.objects.count(), 1)
        progress = ModuleProgress.objects.get(user=self.user, module_key="technical")
        self.assertEqual(progress.step_index, 5)
        self.assertTrue(progress.completed)

    def test_complete_module_marks_completed(self):
        response = self.client.post(
            reverse("learning-progress-complete"),
            {"module_key": "financial"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        progress = ModuleProgress.objects.get(user=self.user, module_key="financial")
        self.assertTrue(progress.completed)
        self.assertEqual(progress.step_index, 4)

    def test_rejects_invalid_module_key(self):
        response = self.client.put(
            reverse("learning-progress"),
            {"module_key": "unknown", "step_index": 1},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data["success"])

    def test_advanced_module_key_is_supported(self):
        response = self.client.put(
            reverse("learning-progress"),
            {"module_key": "advanced", "step_index": 2, "completed": False},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        progress = ModuleProgress.objects.get(user=self.user, module_key="advanced")
        self.assertEqual(progress.step_index, 2)

    def test_technical_rejects_step_index_beyond_frontend_step_count(self):
        response = self.client.put(
            reverse("learning-progress"),
            {"module_key": "technical", "step_index": 7},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("Must be <= 6", str(response.data["error"]["details"]["step_index"]))
