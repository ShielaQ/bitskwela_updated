from django.db import models
from django.contrib.auth.models import User


class ModuleProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="module_progress")
    module_key = models.CharField(max_length=100)
    step_index = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "module_key")

    def __str__(self):
        return f"{self.user.username} - {self.module_key}"
