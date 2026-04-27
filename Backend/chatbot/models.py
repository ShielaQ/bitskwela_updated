from django.db import models
from django.contrib.auth.models import User


class ChatConversation(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chat_conversations",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.username if self.user else "anonymous"
        return f"{username} conversation {self.id}"


class ChatMessage(models.Model):
    ROLE_USER = "user"
    ROLE_BOT = "bot"
    ROLE_SYSTEM = "system"
    ROLE_CHOICES = [
        (ROLE_USER, "User"),
        (ROLE_BOT, "Bot"),
        (ROLE_SYSTEM, "System"),
    ]

    conversation = models.ForeignKey(
        ChatConversation, on_delete=models.CASCADE, related_name="messages"
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} message {self.id}"


class ChatbotKnowledgeEntry(models.Model):
    CATEGORY_GENERAL = "general"
    CATEGORY_PLATFORM = "platform"
    CATEGORY_CALCULATOR = "calculator"
    CATEGORY_LEARNING = "learning"
    CATEGORY_SUPPORT = "support"

    CATEGORY_CHOICES = [
        (CATEGORY_GENERAL, "General"),
        (CATEGORY_PLATFORM, "Platform"),
        (CATEGORY_CALCULATOR, "Calculator"),
        (CATEGORY_LEARNING, "Learning"),
        (CATEGORY_SUPPORT, "Support"),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default=CATEGORY_GENERAL)
    keywords = models.JSONField(default=list, blank=True)
    prompt_key = models.CharField(max_length=120, unique=True)
    answer_text = models.TextField()
    source_ref = models.CharField(max_length=255, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.prompt_key


class LessonSolution(models.Model):
    module_key = models.CharField(max_length=100)
    step_id = models.CharField(max_length=120)
    step_title = models.CharField(max_length=255)
    instruction = models.TextField(blank=True, default="")
    solution_map = models.JSONField(default=dict, blank=True)
    items = models.JSONField(default=list, blank=True)
    zones = models.JSONField(default=list, blank=True)
    explanations = models.JSONField(default=dict, blank=True)
    source_ref = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("module_key", "step_id")

    def __str__(self):
        return f"{self.module_key}:{self.step_id}"
