import uuid
from unittest.mock import Mock, patch

from django.contrib.auth.models import User
from django.core.management import call_command
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import UserProfile
from chatbot.context_builder import build_chat_prompt_context, is_solution_seeking
from chatbot.management.commands.seed_chatbot_context import parse_response_bank, parse_simulation_modules
from chatbot.models import ChatConversation, ChatMessage, ChatbotKnowledgeEntry, LessonSolution
from chatbot.services import classify_intent, llm_first_chat_reply


class ChatIntentRoutingTests(APITestCase):
    def test_classify_intent_routes_expected_categories(self):
        self.assertEqual(classify_intent("Show my calculator projection"), "calculator_assistance")
        self.assertEqual(classify_intent("Where do I start this module?"), "platform_navigation")
        self.assertEqual(classify_intent("What is blockchain gas?"), "learning_assistance")
        self.assertEqual(classify_intent("hello there"), "general")


class ChatContextBuilderTests(APITestCase):
    def setUp(self):
        ChatbotKnowledgeEntry.objects.create(
            prompt_key="kb-sim-1",
            category=ChatbotKnowledgeEntry.CATEGORY_LEARNING,
            keywords=["simulation", "module", "lesson"],
            answer_text="Simulations are drag-and-drop learning activities.",
            source_ref="frontend-chatbot",
        )
        LessonSolution.objects.create(
            module_key="financial",
            step_id="wallet-types",
            step_title="Wallet Types",
            instruction="Drag each item to the right wallet category.",
            solution_map={"btc": "cold", "usdt": "hot"},
            items=[{"id": "btc", "label": "Bitcoin"}],
            zones=[{"id": "cold", "label": "Cold Wallet"}],
            explanations={"cold": "Bitcoin is best held in cold storage."},
            source_ref="simulationData",
        )

    def test_solution_seeking_detector(self):
        self.assertTrue(is_solution_seeking("Can you give me the exact answer?"))
        self.assertFalse(is_solution_seeking("Can you help me understand this step?"))

    def test_prompt_context_includes_guardrails_and_lesson_solution(self):
        payload = build_chat_prompt_context(
            message="Give me the answer for this lesson",
            intent="learning_assistance",
            context={"module_key": "financial", "step_id": "wallet-types"},
        )

        self.assertIn("Never provide the full final answer mapping", payload["system"])
        self.assertIn("Socratic", payload["system"])
        self.assertTrue(payload["context"]["answer_guard"]["solution_seeking"])
        self.assertIsNotNone(payload["context"]["lesson_solution"])
        self.assertEqual(payload["context"]["lesson_solution"]["step_id"], "wallet-types")
        self.assertGreaterEqual(len(payload["context"]["knowledge_base"]), 1)


class ChatServicePromptWiringTests(APITestCase):
    @patch("chatbot.services.LLMClient")
    def test_llm_first_chat_reply_uses_context_builder_rules(self, llm_client_cls):
        mock_client = Mock()
        mock_client.available.return_value = True
        mock_client.chat_response.return_value = {
            "reply": "Try identifying which item is for offline custody first.",
            "intent": "learning_assistance",
            "meta": {"provider": "mock"},
        }
        llm_client_cls.return_value = mock_client

        result = llm_first_chat_reply(
            message="Please give me the exact answer",
            context={"module_key": "financial", "step_id": "wallet-types"},
        )

        self.assertFalse(result["degraded"])
        self.assertTrue(result["provider_meta"]["socratic_mode"])

        sent_payload = mock_client.chat_response.call_args.args[0]
        self.assertIn("Never provide the full final answer mapping", sent_payload["system"])
        self.assertIn("answer_guard", sent_payload["context"])


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

    @patch("chatbot.views.llm_first_chat_reply")
    def test_chat_allows_anonymous(self, llm_mock):
        llm_mock.return_value = {
            "intent": "general",
            "reply": "Hi from deterministic mock.",
            "degraded": False,
            "degradation_reason": None,
            "provider_meta": {"provider": "mock"},
        }

        response = self.client.post(reverse("chat"), {"message": "hello"}, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])
        self.assertEqual(ChatConversation.objects.filter(user__isnull=True).count(), 1)

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
            {
                "message": "hello",
                "context": {"screen": "calculator"},
                "module_key": "financial",
                "step_id": "wallet-types",
                "attempt_count": 2,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["reply"], "Hi from deterministic mock.")
        self.assertEqual(ChatConversation.objects.filter(user=self.user).count(), 1)
        self.assertEqual(ChatMessage.objects.count(), 2)

        persisted_context = ChatMessage.objects.filter(role="user").first().metadata["context"]
        self.assertEqual(persisted_context["module_key"], "financial")
        self.assertEqual(persisted_context["step_id"], "wallet-types")
        self.assertEqual(persisted_context["attempt_count"], 2)

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


class ChatbotSeedCommandTests(APITestCase):
    def test_parser_helpers_read_frontend_sources(self):
        frontend_root = (
            __import__("pathlib").Path(__file__).resolve().parents[2] / "Frontend"
        )
        kb = parse_response_bank(frontend_root)
        modules = parse_simulation_modules(frontend_root)

        self.assertGreater(len(kb), 5)
        self.assertGreater(len(modules), 5)
        self.assertIn("keywords", kb[0])
        self.assertIn("solution_map", modules[0])

    def test_seed_command_persists_records(self):
        call_command("seed_chatbot_context")
        self.assertGreater(ChatbotKnowledgeEntry.objects.count(), 5)
        self.assertGreater(LessonSolution.objects.count(), 5)
