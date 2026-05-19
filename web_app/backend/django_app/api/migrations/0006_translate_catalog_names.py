from django.db import migrations


WORKOUT_TRANSLATIONS = {
    "strength-forge": {
        "title": "Силовая база",
        "list_meta": "52 мин · Верх тела",
        "duration": "52 мин",
        "calories": "540 ккал",
        "level": "Уровень 04",
        "hero_eyebrow": "12-недельный план",
        "phases": [
            ("Разминка", "12 мин"),
            ("Сила", "28 мин"),
            ("Мобилити", "12 мин"),
        ],
    },
    "pool-conditioning": {
        "title": "Бассейн и выносливость",
        "list_meta": "38 мин · Кардио",
        "duration": "38 мин",
        "calories": "410 ккал",
        "level": "Уровень 03",
        "hero_eyebrow": "Перезапуск выносливости",
        "phases": [
            ("Подготовка", "8 мин"),
            ("Интервалы", "22 мин"),
            ("Заминка", "8 мин"),
        ],
    },
    "mobility-reset": {
        "title": "Мобилити-сброс",
        "list_meta": "24 мин · Восстановление",
        "duration": "24 мин",
        "calories": "140 ккал",
        "level": "Уровень 01",
        "hero_eyebrow": "Режим восстановления",
        "phases": [
            ("Дыхание", "6 мин"),
            ("Мобилити", "14 мин"),
            ("Сброс", "4 мин"),
        ],
    },
    "tempo-run": {
        "title": "Темповый бег",
        "list_meta": "34 мин · Бег",
        "duration": "34 мин",
        "calories": "360 ккал",
        "level": "Уровень 03",
        "hero_eyebrow": "Экономичность бега",
        "phases": [
            ("Разминка", "10 мин"),
            ("Темп", "18 мин"),
            ("Спокойный шаг", "6 мин"),
        ],
    },
    "leg-power": {
        "title": "Сила ног",
        "list_meta": "46 мин · Низ тела",
        "duration": "46 мин",
        "calories": "500 ккал",
        "level": "Уровень 04",
        "hero_eyebrow": "Силовая сессия",
        "phases": [
            ("Активация", "8 мин"),
            ("Базовые подходы", "30 мин"),
            ("Заминка", "8 мин"),
        ],
    },
}


COACH_SPECIALITIES = {
    "Marcus Bell": "Силовая техника",
    "Nina Park": "Выносливость и восстановление",
    "Arseniy Volk": "Экономичность бега",
}


SCHEDULE_META_UPDATES = {
    "mobility-reset": {
        "Recovery lounge · подвижность": "Зона восстановления · подвижность",
        "Recovery lounge · вечерний сброс": "Зона восстановления · вечерний сброс",
        "Recovery lounge · суставы и дыхание": "Зона восстановления · суставы и дыхание",
    }
}


def translate_catalog(apps, schema_editor):
    Coach = apps.get_model("api", "Coach")
    Workout = apps.get_model("api", "Workout")
    WorkoutPhase = apps.get_model("api", "WorkoutPhase")
    ScheduleSlot = apps.get_model("api", "ScheduleSlot")

    for coach_name, speciality in COACH_SPECIALITIES.items():
        Coach.objects.filter(name=coach_name).update(speciality=speciality)

    for slug, values in WORKOUT_TRANSLATIONS.items():
        workout = Workout.objects.filter(slug=slug).first()

        if workout is None:
            continue

        for field in ["title", "list_meta", "duration", "calories", "level", "hero_eyebrow"]:
            setattr(workout, field, values[field])
        workout.save(update_fields=["title", "list_meta", "duration", "calories", "level", "hero_eyebrow"])

        for phase, (label, value) in zip(WorkoutPhase.objects.filter(workout=workout).order_by("position"), values["phases"]):
            phase.label = label
            phase.value = value
            phase.save(update_fields=["label", "value"])

        ScheduleSlot.objects.filter(workout=workout).update(title=values["title"])

        for current_meta, translated_meta in SCHEDULE_META_UPDATES.get(slug, {}).items():
            ScheduleSlot.objects.filter(workout=workout, meta=current_meta).update(meta=translated_meta)


def reverse_translate_catalog(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0005_extend_schedule_week"),
    ]

    operations = [
        migrations.RunPython(translate_catalog, reverse_translate_catalog),
    ]
