from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0002_seed_catalog"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "sex",
                    models.CharField(
                        choices=[("male", "Мужской"), ("female", "Женский"), ("other", "Другой")],
                        max_length=16,
                    ),
                ),
                (
                    "age",
                    models.PositiveSmallIntegerField(validators=[MinValueValidator(12), MaxValueValidator(90)]),
                ),
                ("height_cm", models.DecimalField(decimal_places=1, max_digits=5)),
                ("weight_kg", models.DecimalField(decimal_places=1, max_digits=5)),
                (
                    "goal",
                    models.CharField(
                        choices=[
                            ("fat_loss", "Снижение веса"),
                            ("muscle_gain", "Набор мышц"),
                            ("endurance", "Выносливость"),
                            ("wellness", "Здоровье и тонус"),
                            ("recomposition", "Рекомпозиция"),
                        ],
                        max_length=24,
                    ),
                ),
                ("nutrition_recommendations", models.JSONField(blank=True, default=list)),
                ("daily_workout", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["user_id"]},
        ),
    ]
