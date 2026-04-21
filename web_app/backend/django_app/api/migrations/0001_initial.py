from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Coach",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, unique=True)),
                ("role", models.CharField(max_length=120)),
                ("focus", models.TextField()),
                ("experience", models.CharField(max_length=120)),
                ("availability", models.CharField(max_length=120)),
                ("speciality", models.CharField(max_length=120)),
                ("image", models.CharField(blank=True, max_length=255)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="Workout",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(unique=True)),
                ("title", models.CharField(max_length=120)),
                (
                    "category",
                    models.CharField(
                        choices=[("strength", "Strength"), ("cardio", "Cardio"), ("mobility", "Mobility")],
                        max_length=16,
                    ),
                ),
                ("accent", models.CharField(max_length=16)),
                ("list_meta", models.CharField(max_length=120)),
                ("detail_meta", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("duration", models.CharField(max_length=40)),
                ("calories", models.CharField(max_length=40)),
                ("level", models.CharField(max_length=40)),
                ("hero_eyebrow", models.CharField(max_length=80)),
                ("hero_lead", models.CharField(max_length=255)),
            ],
            options={"ordering": ["title"]},
        ),
        migrations.CreateModel(
            name="WorkoutPhase",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label", models.CharField(max_length=80)),
                ("value", models.CharField(max_length=40)),
                ("tone", models.CharField(max_length=16)),
                ("width", models.CharField(max_length=16)),
                ("position", models.PositiveSmallIntegerField(default=0)),
                (
                    "workout",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="phases", to="api.workout"),
                ),
            ],
            options={"ordering": ["position", "id"]},
        ),
        migrations.CreateModel(
            name="ScheduleSlot",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("day_id", models.CharField(max_length=16)),
                ("day", models.CharField(max_length=16)),
                ("date", models.CharField(max_length=32)),
                ("load", models.CharField(max_length=120)),
                ("time", models.CharField(max_length=32)),
                ("title", models.CharField(max_length=120)),
                ("meta", models.CharField(max_length=255)),
                ("spots", models.CharField(max_length=80)),
                ("status", models.CharField(max_length=80)),
                ("position", models.PositiveSmallIntegerField(default=0)),
                (
                    "coach",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="schedule_slots", to="api.coach"),
                ),
                (
                    "workout",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="schedule_slots", to="api.workout"),
                ),
            ],
            options={"ordering": ["position", "id"]},
        ),
    ]
