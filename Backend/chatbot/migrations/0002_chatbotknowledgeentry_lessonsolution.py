from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chatbot", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ChatbotKnowledgeEntry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("general", "General"),
                            ("platform", "Platform"),
                            ("calculator", "Calculator"),
                            ("learning", "Learning"),
                            ("support", "Support"),
                        ],
                        default="general",
                        max_length=20,
                    ),
                ),
                ("keywords", models.JSONField(blank=True, default=list)),
                ("prompt_key", models.CharField(max_length=120, unique=True)),
                ("answer_text", models.TextField()),
                ("source_ref", models.CharField(blank=True, default="", max_length=255)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="LessonSolution",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("module_key", models.CharField(max_length=100)),
                ("step_id", models.CharField(max_length=120)),
                ("step_title", models.CharField(max_length=255)),
                ("instruction", models.TextField(blank=True, default="")),
                ("solution_map", models.JSONField(blank=True, default=dict)),
                ("items", models.JSONField(blank=True, default=list)),
                ("zones", models.JSONField(blank=True, default=list)),
                ("explanations", models.JSONField(blank=True, default=dict)),
                ("source_ref", models.CharField(blank=True, default="", max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"unique_together": {("module_key", "step_id")}},
        ),
    ]
