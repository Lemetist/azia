from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0007_rename_api_workout_user_id_e9f565_idx_api_workout_user_id_3765b1_idx"),
    ]

    operations = [
        migrations.CreateModel(
            name="Exercise",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("source_id", models.CharField(max_length=80, unique=True)),
                ("name", models.CharField(max_length=160)),
                ("name_en", models.CharField(blank=True, max_length=160)),
                ("slug", models.SlugField(unique=True)),
                ("slug_en", models.SlugField(blank=True, null=True, unique=True)),
                ("description", models.TextField(blank=True)),
                ("description_en", models.TextField(blank=True)),
                ("introduction", models.TextField(blank=True)),
                ("introduction_en", models.TextField(blank=True)),
                ("video_url", models.URLField(blank=True, max_length=500)),
                ("image_url", models.URLField(blank=True, max_length=500)),
            ],
            options={"ordering": ["name_en", "name"]},
        ),
        migrations.CreateModel(
            name="ExerciseAttribute",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "name",
                    models.CharField(
                        choices=[
                            ("TYPE", "Type"),
                            ("PRIMARY_MUSCLE", "Primary muscle"),
                            ("SECONDARY_MUSCLE", "Secondary muscle"),
                            ("EQUIPMENT", "Equipment"),
                            ("MECHANICS_TYPE", "Mechanics type"),
                        ],
                        max_length=32,
                    ),
                ),
                ("value", models.CharField(max_length=64)),
                (
                    "exercise",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="attributes",
                        to="api.exercise",
                    ),
                ),
            ],
            options={"ordering": ["name", "value", "id"]},
        ),
        migrations.CreateModel(
            name="WorkoutExercise",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("prescription", models.CharField(max_length=120)),
                ("coaching_note", models.CharField(blank=True, max_length=255)),
                ("position", models.PositiveSmallIntegerField(default=0)),
                (
                    "exercise",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="workout_links",
                        to="api.exercise",
                    ),
                ),
                (
                    "workout",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="exercise_links",
                        to="api.workout",
                    ),
                ),
            ],
            options={"ordering": ["position", "id"]},
        ),
        migrations.AddConstraint(
            model_name="exerciseattribute",
            constraint=models.UniqueConstraint(
                fields=("exercise", "name", "value"),
                name="api_unique_exercise_attribute",
            ),
        ),
        migrations.AddConstraint(
            model_name="workoutexercise",
            constraint=models.UniqueConstraint(
                fields=("workout", "exercise"),
                name="api_unique_workout_exercise",
            ),
        ),
    ]
