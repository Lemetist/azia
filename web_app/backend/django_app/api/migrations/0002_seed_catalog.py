from django.db import migrations


def seed_catalog(apps, schema_editor):
    Coach = apps.get_model("api", "Coach")
    Workout = apps.get_model("api", "Workout")
    WorkoutPhase = apps.get_model("api", "WorkoutPhase")
    ScheduleSlot = apps.get_model("api", "ScheduleSlot")

    coach_specs = [
        {
            "name": "Marcus Bell",
            "role": "Силовой тренер",
            "focus": "Гипертрофия, техника со штангой, цикл под рост силы",
            "experience": "9 лет опыта",
            "availability": "Свободен для 2 новых атлетов",
            "speciality": "Barbell systems",
            "image": "/images/gym-reference.jpg",
        },
        {
            "name": "Nina Park",
            "role": "Тренер по плаванию",
            "focus": "Выносливость, контроль дыхания, темп восстановления",
            "experience": "7 лет опыта",
            "availability": "Свободна по утрам",
            "speciality": "Engine + recovery",
            "image": "/images/gym-bg.png",
        },
        {
            "name": "Arseniy Volk",
            "role": "Тренер по бегу",
            "focus": "Пороговая работа, каденс, подготовка к забегу 10 км",
            "experience": "6 лет опыта",
            "availability": "Свободен по вторникам",
            "speciality": "Running economy",
            "image": "/images/gym-reference.jpg",
        },
    ]

    coaches = {}
    for spec in coach_specs:
        coaches[spec["name"]], _ = Coach.objects.get_or_create(name=spec["name"], defaults=spec)

    workout_specs = [
        {
            "slug": "strength-forge",
            "title": "Strength Forge",
            "category": "strength",
            "accent": "indigo",
            "list_meta": "52 min · Upper body",
            "detail_meta": "Тяги, жим и плотный контроль темпа без провалов по технике.",
            "description": "Силовой блок дня для верха тела с контролируемыми паузами и добивкой корпуса.",
            "duration": "52 min",
            "calories": "540 kcal",
            "level": "Level 04",
            "hero_eyebrow": "12-week plan",
            "hero_lead": "Главный силовой слот недели уже собран и готов к запуску.",
            "phases": [
                {"label": "Warm-up", "value": "12 min", "tone": "gold", "width": "34%"},
                {"label": "Strength", "value": "28 min", "tone": "indigo", "width": "82%"},
                {"label": "Mobility", "value": "12 min", "tone": "coral", "width": "42%"},
            ],
        },
        {
            "slug": "pool-conditioning",
            "title": "Pool Conditioning",
            "category": "cardio",
            "accent": "gold",
            "list_meta": "38 min · Cardio",
            "detail_meta": "Плавание на темпе с коротким восстановлением между отрезками.",
            "description": "Кардио-сессия для дыхания, ритма и разгрузки суставов после силового блока.",
            "duration": "38 min",
            "calories": "410 kcal",
            "level": "Level 03",
            "hero_eyebrow": "Engine reset",
            "hero_lead": "Смена фокуса на выносливость без потери восстановительного окна.",
            "phases": [
                {"label": "Prep", "value": "8 min", "tone": "gold", "width": "26%"},
                {"label": "Intervals", "value": "22 min", "tone": "indigo", "width": "78%"},
                {"label": "Cooldown", "value": "8 min", "tone": "coral", "width": "30%"},
            ],
        },
        {
            "slug": "mobility-reset",
            "title": "Mobility Reset",
            "category": "mobility",
            "accent": "mint",
            "list_meta": "24 min · Recovery",
            "detail_meta": "Мягкая подвижность, дыхание и разгрузка после насыщенных дней.",
            "description": "Короткая recovery-сессия для суставов, дыхания и снижения накопленной усталости.",
            "duration": "24 min",
            "calories": "140 kcal",
            "level": "Level 01",
            "hero_eyebrow": "Recovery mode",
            "hero_lead": "Экран восстановления, который не дает неделе развалиться на пике нагрузки.",
            "phases": [
                {"label": "Breathing", "value": "6 min", "tone": "gold", "width": "22%"},
                {"label": "Mobility", "value": "14 min", "tone": "coral", "width": "66%"},
                {"label": "Reset", "value": "4 min", "tone": "indigo", "width": "18%"},
            ],
        },
        {
            "slug": "tempo-run",
            "title": "Tempo Run",
            "category": "cardio",
            "accent": "coral",
            "list_meta": "34 min · Track",
            "detail_meta": "Беговой темп с ровным дыханием и постепенным выходом в целевую скорость.",
            "description": "Беговая работа на пороге: устойчивый темп, техника шага и экономичность.",
            "duration": "34 min",
            "calories": "360 kcal",
            "level": "Level 03",
            "hero_eyebrow": "Run economy",
            "hero_lead": "Сценарий для ускорения темпа без резкого скачка тренировочного стресса.",
            "phases": [
                {"label": "Warm-up", "value": "10 min", "tone": "gold", "width": "32%"},
                {"label": "Tempo", "value": "18 min", "tone": "coral", "width": "74%"},
                {"label": "Walkdown", "value": "6 min", "tone": "indigo", "width": "24%"},
            ],
        },
        {
            "slug": "leg-power",
            "title": "Leg Power",
            "category": "strength",
            "accent": "indigo",
            "list_meta": "46 min · Lower body",
            "detail_meta": "Низ тела, взрывная работа и силовая плотность без лишнего объема.",
            "description": "Тяжелый блок на ноги с акцентом на силу, скорость штанги и контроль техники.",
            "duration": "46 min",
            "calories": "500 kcal",
            "level": "Level 04",
            "hero_eyebrow": "Power session",
            "hero_lead": "Главный нижний день с понятной фазировкой и быстрым стартом из одного экрана.",
            "phases": [
                {"label": "Primer", "value": "8 min", "tone": "gold", "width": "24%"},
                {"label": "Main lifts", "value": "30 min", "tone": "indigo", "width": "86%"},
                {"label": "Cooldown", "value": "8 min", "tone": "coral", "width": "28%"},
            ],
        },
    ]

    workouts = {}
    for spec in workout_specs:
        phases = spec.pop("phases")
        workout, _ = Workout.objects.get_or_create(slug=spec["slug"], defaults=spec)
        workouts[spec["slug"]] = workout

        if not workout.phases.exists():
            for position, phase in enumerate(phases, start=1):
                WorkoutPhase.objects.create(workout=workout, position=position, **phase)

    slot_specs = [
        {
            "day_id": "mon",
            "day": "Пн",
            "date": "21 апр",
            "load": "Высокая нагрузка",
            "time": "06:45",
            "title": "Tempo Run",
            "meta": "8 км · городской маршрут",
            "spots": "12 мест",
            "status": "Открыта запись",
            "coach": "Arseniy Volk",
            "workout": "tempo-run",
        },
        {
            "day_id": "mon",
            "day": "Пн",
            "date": "21 апр",
            "load": "Высокая нагрузка",
            "time": "18:30",
            "title": "Strength Forge",
            "meta": "Зал A · основная силовая",
            "spots": "4 места",
            "status": "Основной слот",
            "coach": "Marcus Bell",
            "workout": "strength-forge",
        },
        {
            "day_id": "tue",
            "day": "Вт",
            "date": "22 апр",
            "load": "Смешанный день",
            "time": "07:15",
            "title": "Pool Conditioning",
            "meta": "Дорожка 3 · дыхание и темп",
            "spots": "7 мест",
            "status": "Открыта запись",
            "coach": "Nina Park",
            "workout": "pool-conditioning",
        },
        {
            "day_id": "tue",
            "day": "Вт",
            "date": "22 апр",
            "load": "Смешанный день",
            "time": "19:00",
            "title": "Leg Power",
            "meta": "Зал B · низ тела и взрывная сила",
            "spots": "5 мест",
            "status": "Почти заполнено",
            "coach": "Marcus Bell",
            "workout": "leg-power",
        },
        {
            "day_id": "wed",
            "day": "Ср",
            "date": "23 апр",
            "load": "Восстановление + темп",
            "time": "08:00",
            "title": "Mobility Reset",
            "meta": "Recovery lounge · подвижность",
            "spots": "16 мест",
            "status": "Легкий блок",
            "coach": "Nina Park",
            "workout": "mobility-reset",
        },
        {
            "day_id": "wed",
            "day": "Ср",
            "date": "23 апр",
            "load": "Восстановление + темп",
            "time": "18:00",
            "title": "Strength Forge",
            "meta": "Основной зал · круговая работа",
            "spots": "5 мест",
            "status": "Рекомендуем",
            "coach": "Marcus Bell",
            "workout": "strength-forge",
        },
        {
            "day_id": "thu",
            "day": "Чт",
            "date": "24 апр",
            "load": "Контроль темпа",
            "time": "07:10",
            "title": "Pool Conditioning",
            "meta": "Бассейн · интервалы",
            "spots": "8 мест",
            "status": "Хорошее окно",
            "coach": "Nina Park",
            "workout": "pool-conditioning",
        },
        {
            "day_id": "thu",
            "day": "Чт",
            "date": "24 апр",
            "load": "Контроль темпа",
            "time": "19:10",
            "title": "Mobility Reset",
            "meta": "Recovery lounge · вечерний сброс",
            "spots": "14 мест",
            "status": "Свободно",
            "coach": "Nina Park",
            "workout": "mobility-reset",
        },
    ]

    if not ScheduleSlot.objects.exists():
        for position, spec in enumerate(slot_specs, start=1):
            coach_name = spec.pop("coach")
            workout_slug = spec.pop("workout")
            ScheduleSlot.objects.create(
                coach=coaches[coach_name],
                workout=workouts[workout_slug],
                position=position,
                **spec,
            )


def unseed_catalog(apps, schema_editor):
    apps.get_model("api", "ScheduleSlot").objects.all().delete()
    apps.get_model("api", "WorkoutPhase").objects.all().delete()
    apps.get_model("api", "Workout").objects.all().delete()
    apps.get_model("api", "Coach").objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_catalog, unseed_catalog),
    ]
