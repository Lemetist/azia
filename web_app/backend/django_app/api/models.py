from django.db import models


class Coach(models.Model):
    name = models.CharField(max_length=120, unique=True)
    role = models.CharField(max_length=120)
    focus = models.TextField()
    experience = models.CharField(max_length=120)
    availability = models.CharField(max_length=120)
    speciality = models.CharField(max_length=120)
    image = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Workout(models.Model):
    class Category(models.TextChoices):
        STRENGTH = "strength", "Strength"
        CARDIO = "cardio", "Cardio"
        MOBILITY = "mobility", "Mobility"

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    category = models.CharField(max_length=16, choices=Category.choices)
    accent = models.CharField(max_length=16)
    list_meta = models.CharField(max_length=120)
    detail_meta = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.CharField(max_length=40)
    calories = models.CharField(max_length=40)
    level = models.CharField(max_length=40)
    hero_eyebrow = models.CharField(max_length=80)
    hero_lead = models.CharField(max_length=255)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class WorkoutPhase(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="phases")
    label = models.CharField(max_length=80)
    value = models.CharField(max_length=40)
    tone = models.CharField(max_length=16)
    width = models.CharField(max_length=16)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self) -> str:
        return f"{self.workout.title}: {self.label}"


class ScheduleSlot(models.Model):
    day_id = models.CharField(max_length=16)
    day = models.CharField(max_length=16)
    date = models.CharField(max_length=32)
    load = models.CharField(max_length=120)
    time = models.CharField(max_length=32)
    title = models.CharField(max_length=120)
    meta = models.CharField(max_length=255)
    spots = models.CharField(max_length=80)
    status = models.CharField(max_length=80)
    position = models.PositiveSmallIntegerField(default=0)
    coach = models.ForeignKey(
        Coach,
        on_delete=models.PROTECT,
        related_name="schedule_slots",
    )
    workout = models.ForeignKey(
        Workout,
        on_delete=models.PROTECT,
        related_name="schedule_slots",
    )

    class Meta:
        ordering = ["position", "id"]

    def __str__(self) -> str:
        return f"{self.day} {self.time} {self.title}"
