from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):
    dependencies = [
        ("chatbot", "0002_chatbotknowledgeentry_lessonsolution"),
    ]

    operations = [
        migrations.AlterField(
            model_name="chatconversation",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="chat_conversations",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
