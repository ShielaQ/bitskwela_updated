import uuid
from unittest.mock import patch

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import UserProfile
from chatbot.models import ChatConversation, ChatMessage
from chatbot.services import classify_intent


class ChatIntentRoutingTests(APITestCase):
    def test_classify_intent_routes_expected_categories(self):
        self.assertEqual(classify_intent("Show my calculator projection"), "calculator_assistance")
        self.assertEqual(classify_intent("Where do I start this module?"), "platform_navigation")
        self.assertEqual(classify_intent("What is blockchain gas?"), "learning_assistance")
        self.assertEqual(classify_intent("hello there"), "general")


class ChatbotAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="chat_user", password="x")
        self.other_user = User.objects.create_user(username="chat_other", password="x")
        UserProfile.objects.create(
            user=self.user,
            supabase_user_id=uuid.uuid4(),
            email="chat_user@test.local",
        )
        UserProfile.objects.create(
            user=self.other_user,
            supabase_user_id=uuid.uuid4(),
            email="chat_other@test.local",
        )

    def test_chat_requires_authentication(self):
        response = self.client.post(reverse("chat"), {"message": "hello"}, format="json")
        self.assertEqual(response.status_code, 401)

    @patch("chatbot.views.llm_first_chat_reply")
    def test_chat_returns_contract_and_persists_messages(self, llm_mock):
        llm_mock.return_value = {
            "intent": "general",
            "reply": "Hi from deterministic mock.",
            "degraded": False,
            "degradation_reason": None,
            "provider_meta": {"provider": "mock"},
        }
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            reverse("chat"),
            {"message": "hello", "context": {"screen": "calculator"}},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["reply"], "Hi from deterministic mock.")
        self.assertEqual(ChatConversation.objects.filter(user=self.user).count(), 1)
        self.assertEqual(ChatMessage.objects.count(), 2)

    @patch("chatbot.views.llm_first_chat_reply")
    def test_chat_rejects_other_users_conversation_id(self, llm_mock):
        llm_mock.return_value = {
            "intent": "general",
            "reply": "unused",
            "degraded": False,
            "degradation_reason": None,
            "provider_meta": {},
        }
        conversation = ChatConversation.objects.create(user=self.other_user, title="Other")
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            reverse("chat"),
            {"message": "hello", "conversation_id": conversation.id},
            format="json",
        )
        self.assertEqual(response.status_code, 404)

    def test_history_only_returns_authenticated_user_conversations(self):
        own_conversation = ChatConversation.objects.create(user=self.user, title="Mine")
        other_conversation = ChatConversation.objects.create(user=self.other_user, title="Not mine")
        ChatMessage.objects.create(conversation=own_conversation, role="user", content="mine")
        ChatMessage.objects.create(conversation=other_conversation, role="user", content="other")

        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse("chat-history"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["count"], 1)
        self.assertEqual(response.data["data"]["items"][0]["conversation_id"], own_conversation.id)
