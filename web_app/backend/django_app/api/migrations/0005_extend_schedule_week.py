from django.db import migrations


EXTRA_SLOT_SPECS = [
    {
        "day_id": "fri",
        "day": "Пт",
        "date": "25 апр",
        "load": "Силовой акцент",
        "time": "07:30",
        "title": "Силовая база",
        "meta": "Зал A · техника и базовые подходы",
        "spots": "6 мест",
        "status": "Открыта запись",
        "coach": "Marcus Bell",
        "workout": "strength-forge",
    },
    {
        "day_id": "fri",
        "day": "Пт",
        "date": "25 апр",
        "load": "Силовой акцент",
        "time": "18:45",
        "title": "Темповый бег",
        "meta": "Манеж · ровный темп",
        "spots": "10 мест",
        "status": "Хорошее окно",
        "coach": "Arseniy Volk",
        "workout": "tempo-run",
    },
    {
        "day_id": "sat",
        "day": "Сб",
        "date": "26 апр",
        "load": "Групповой день",
        "time": "10:15",
        "title": "Мобилити-сброс",
        "meta": "Зона восстановления · суставы и дыхание",
        "spots": "18 мест",
        "status": "Свободно",
        "coach": "Nina Park",
        "workout": "mobility-reset",
    },
    {
        "day_id": "sat",
        "day": "Сб",
        "date": "26 апр",
        "load": "Групповой день",
        "time": "12:00",
        "title": "Сила ног",
        "meta": "Зал B · мощность и прыжковая работа",
        "spots": "3 места",
        "status": "Почти заполнено",
        "coach": "Marcus Bell",
        "workout": "leg-power",
    },
    {
        "day_id": "sun",
        "day": "Вс",
        "date": "27 апр",
        "load": "Восстановление",
        "time": "11:00",
        "title": "Бассейн и выносливость",
        "meta": "Бассейн · легкая аэробная работа",
        "spots": "12 мест",
        "status": "Открыта запись",
        "coach": "Nina Park",
        "workout": "pool-conditioning",
    },
]


def extend_schedule(apps, schema_editor):
    ScheduleSlot = apps.get_model("api", "ScheduleSlot")
    Coach = apps.get_model("api", "Coach")
    Workout = apps.get_model("api", "Workout")

    next_position = (ScheduleSlot.objects.order_by("-position").values_list("position", flat=True).first() or 0) + 1

    for offset, spec in enumerate(EXTRA_SLOT_SPECS):
        if ScheduleSlot.objects.filter(
            day_id=spec["day_id"],
            time=spec["time"],
            title=spec["title"],
        ).exists():
            continue

        ScheduleSlot.objects.create(
            day_id=spec["day_id"],
            day=spec["day"],
            date=spec["date"],
            load=spec["load"],
            time=spec["time"],
            title=spec["title"],
            meta=spec["meta"],
            spots=spec["spots"],
            status=spec["status"],
            position=next_position + offset,
            coach=Coach.objects.get(name=spec["coach"]),
            workout=Workout.objects.get(slug=spec["workout"]),
        )


def shrink_schedule(apps, schema_editor):
    ScheduleSlot = apps.get_model("api", "ScheduleSlot")

    for spec in EXTRA_SLOT_SPECS:
        ScheduleSlot.objects.filter(
            day_id=spec["day_id"],
            time=spec["time"],
            title=spec["title"],
        ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_workoutsession"),
    ]

    operations = [
        migrations.RunPython(extend_schedule, shrink_schedule),
    ]
