from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_userprofile"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="WorkoutSession",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("elapsed_seconds", models.PositiveIntegerField()),
                ("completed_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="workout_sessions",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "workout",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="completed_sessions",
                        to="api.workout",
                    ),
                ),
            ],
            options={
                "ordering": ["-completed_at", "-id"],
            },
        ),
        migrations.AddIndex(
            model_name="workoutsession",
            index=models.Index(fields=["user", "workout", "-completed_at"], name="api_workout_user_id_e9f565_idx"),
        ),
    ]
