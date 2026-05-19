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
            "speciality": "Силовая техника",
            "image": "/images/gym-reference.jpg",
        },
        {
            "name": "Nina Park",
            "role": "Тренер по плаванию",
            "focus": "Выносливость, контроль дыхания, темп восстановления",
            "experience": "7 лет опыта",
            "availability": "Свободна по утрам",
            "speciality": "Выносливость и восстановление",
            "image": "/images/gym-bg.png",
        },
        {
            "name": "Arseniy Volk",
            "role": "Тренер по бегу",
            "focus": "Пороговая работа, каденс, подготовка к забегу 10 км",
            "experience": "6 лет опыта",
            "availability": "Свободен по вторникам",
            "speciality": "Экономичность бега",
            "image": "/images/gym-reference.jpg",
        },
    ]

    coaches = {}
    for spec in coach_specs:
        coaches[spec["name"]], _ = Coach.objects.get_or_create(name=spec["name"], defaults=spec)

    workout_specs = [
        {
            "slug": "strength-forge",
            "title": "Силовая база",
            "category": "strength",
            "accent": "indigo",
            "list_meta": "52 мин · Верх тела",
            "detail_meta": "Тяги, жим и плотный контроль темпа без провалов по технике.",
            "description": "Силовой блок дня для верха тела с контролируемыми паузами и добивкой корпуса.",
            "duration": "52 мин",
            "calories": "540 ккал",
            "level": "Уровень 04",
            "hero_eyebrow": "12-недельный план",
            "hero_lead": "Главный силовой слот недели уже собран и готов к запуску.",
            "phases": [
                {"label": "Разминка", "value": "12 мин", "tone": "gold", "width": "34%"},
                {"label": "Сила", "value": "28 мин", "tone": "indigo", "width": "82%"},
                {"label": "Мобилити", "value": "12 мин", "tone": "coral", "width": "42%"},
            ],
        },
        {
            "slug": "pool-conditioning",
            "title": "Бассейн и выносливость",
            "category": "cardio",
            "accent": "gold",
            "list_meta": "38 мин · Кардио",
            "detail_meta": "Плавание на темпе с коротким восстановлением между отрезками.",
            "description": "Кардио-сессия для дыхания, ритма и разгрузки суставов после силового блока.",
            "duration": "38 мин",
            "calories": "410 ккал",
            "level": "Уровень 03",
            "hero_eyebrow": "Перезапуск выносливости",
            "hero_lead": "Смена фокуса на выносливость без потери восстановительного окна.",
            "phases": [
                {"label": "Подготовка", "value": "8 мин", "tone": "gold", "width": "26%"},
                {"label": "Интервалы", "value": "22 мин", "tone": "indigo", "width": "78%"},
                {"label": "Заминка", "value": "8 мин", "tone": "coral", "width": "30%"},
            ],
        },
        {
            "slug": "mobility-reset",
            "title": "Мобилити-сброс",
            "category": "mobility",
            "accent": "mint",
            "list_meta": "24 мин · Восстановление",
            "detail_meta": "Мягкая подвижность, дыхание и разгрузка после насыщенных дней.",
            "description": "Короткая recovery-сессия для суставов, дыхания и снижения накопленной усталости.",
            "duration": "24 мин",
            "calories": "140 ккал",
            "level": "Уровень 01",
            "hero_eyebrow": "Режим восстановления",
            "hero_lead": "Экран восстановления, который не дает неделе развалиться на пике нагрузки.",
            "phases": [
                {"label": "Дыхание", "value": "6 мин", "tone": "gold", "width": "22%"},
                {"label": "Мобилити", "value": "14 мин", "tone": "coral", "width": "66%"},
                {"label": "Сброс", "value": "4 мин", "tone": "indigo", "width": "18%"},
            ],
        },
        {
            "slug": "tempo-run",
            "title": "Темповый бег",
            "category": "cardio",
            "accent": "coral",
            "list_meta": "34 мин · Бег",
            "detail_meta": "Беговой темп с ровным дыханием и постепенным выходом в целевую скорость.",
            "description": "Беговая работа на пороге: устойчивый темп, техника шага и экономичность.",
            "duration": "34 мин",
            "calories": "360 ккал",
            "level": "Уровень 03",
            "hero_eyebrow": "Экономичность бега",
            "hero_lead": "Сценарий для ускорения темпа без резкого скачка тренировочного стресса.",
            "phases": [
                {"label": "Разминка", "value": "10 мин", "tone": "gold", "width": "32%"},
                {"label": "Темп", "value": "18 мин", "tone": "coral", "width": "74%"},
                {"label": "Спокойный шаг", "value": "6 мин", "tone": "indigo", "width": "24%"},
            ],
        },
        {
            "slug": "leg-power",
            "title": "Сила ног",
            "category": "strength",
            "accent": "indigo",
            "list_meta": "46 мин · Низ тела",
            "detail_meta": "Низ тела, взрывная работа и силовая плотность без лишнего объема.",
            "description": "Тяжелый блок на ноги с акцентом на силу, скорость штанги и контроль техники.",
            "duration": "46 мин",
            "calories": "500 ккал",
            "level": "Уровень 04",
            "hero_eyebrow": "Силовая сессия",
            "hero_lead": "Главный нижний день с понятной фазировкой и быстрым стартом из одного экрана.",
            "phases": [
                {"label": "Активация", "value": "8 мин", "tone": "gold", "width": "24%"},
                {"label": "Базовые подходы", "value": "30 мин", "tone": "indigo", "width": "86%"},
                {"label": "Заминка", "value": "8 мин", "tone": "coral", "width": "28%"},
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
            "title": "Темповый бег",
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
            "title": "Силовая база",
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
            "title": "Бассейн и выносливость",
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
            "title": "Сила ног",
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
            "title": "Мобилити-сброс",
            "meta": "Зона восстановления · подвижность",
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
            "title": "Силовая база",
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
            "title": "Бассейн и выносливость",
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
            "title": "Мобилити-сброс",
            "meta": "Зона восстановления · вечерний сброс",
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
