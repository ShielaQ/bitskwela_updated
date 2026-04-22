from django.db import models
from django.contrib.auth.models import User


class ChatConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_conversations")
    title = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} conversation {self.id}"


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
