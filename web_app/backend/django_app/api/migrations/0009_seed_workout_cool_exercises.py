from django.db import migrations


EXERCISES = [
    {
        "source_id": "workout-cool-157",
        "name": "Fentes arrieres a la barre",
        "name_en": "Barbell Alternating Reverse Lunges",
        "slug": "workout-cool-barbell-alternating-reverse-lunges",
        "slug_en": "barbell-alternating-reverse-lunges",
        "description_en": (
            "Step back with one foot under a barbell, lower until both legs are controlled, "
            "then drive back to the start and alternate sides."
        ),
        "introduction_en": "A unilateral strength movement for leg strength, balance and glute control.",
        "video_url": "https://www.youtube.com/embed/NmfQzqGktgs?autoplay=1",
        "image_url": "https://img.youtube.com/vi/NmfQzqGktgs/hqdefault.jpg",
        "attributes": [
            ("TYPE", "STRENGTH"),
            ("PRIMARY_MUSCLE", "QUADRICEPS"),
            ("SECONDARY_MUSCLE", "GLUTES"),
            ("SECONDARY_MUSCLE", "HAMSTRINGS"),
            ("EQUIPMENT", "BARBELL"),
            ("EQUIPMENT", "BAR"),
            ("MECHANICS_TYPE", "COMPOUND"),
        ],
    },
    {
        "source_id": "workout-cool-163",
        "name": "Tirage horizontal corde a la poulie haute",
        "name_en": "Facepulls",
        "slug": "workout-cool-facepulls",
        "slug_en": "facepulls",
        "description_en": (
            "Pull a cable rope toward the upper chest while keeping a stable torso and "
            "finishing with the shoulder blades squeezed together."
        ),
        "introduction_en": "An isolation pull for posterior shoulders and upper-back control.",
        "video_url": "https://www.youtube.com/embed/3ZViIERC1QQ?autoplay=1",
        "image_url": "https://img.youtube.com/vi/3ZViIERC1QQ/hqdefault.jpg",
        "attributes": [
            ("TYPE", "STRENGTH"),
            ("PRIMARY_MUSCLE", "SHOULDERS"),
            ("SECONDARY_MUSCLE", "FOREARMS"),
            ("EQUIPMENT", "CABLE"),
            ("EQUIPMENT", "ROPE"),
            ("MECHANICS_TYPE", "ISOLATION"),
        ],
    },
    {
        "source_id": "workout-cool-164",
        "name": "Sauts alternes aux cotes du banc",
        "name_en": "Bench Hops",
        "slug": "workout-cool-bench-hops",
        "slug_en": "bench-hops",
        "description_en": (
            "Use a bench as the target, hop across it with bent-knee landings and keep "
            "the rhythm quick without losing control."
        ),
        "introduction_en": "A compound power drill for agility, cardio rhythm and full-body drive.",
        "video_url": "https://www.youtube.com/embed/R3TCOHRwCl8?autoplay=1",
        "image_url": "https://img.youtube.com/vi/R3TCOHRwCl8/hqdefault.jpg",
        "attributes": [
            ("TYPE", "PLYOMETRICS"),
            ("TYPE", "CROSSFIT"),
            ("TYPE", "CARDIO"),
            ("PRIMARY_MUSCLE", "FULL_BODY"),
            ("EQUIPMENT", "BENCH"),
            ("MECHANICS_TYPE", "COMPOUND"),
        ],
    },
]


WORKOUT_LINKS = [
    {
        "workout": "strength-forge",
        "exercise": "workout-cool-facepulls",
        "position": 1,
        "prescription": "3 x 12 контролируемых повторов",
        "coaching_note": "Соберите лопатки в конце тяги и не поднимайте плечи.",
    },
    {
        "workout": "strength-forge",
        "exercise": "workout-cool-barbell-alternating-reverse-lunges",
        "position": 2,
        "prescription": "3 x 8 на каждую ногу",
        "coaching_note": "Шаг назад держит корпус устойчивым перед рабочим силовым блоком.",
    },
    {
        "workout": "leg-power",
        "exercise": "workout-cool-barbell-alternating-reverse-lunges",
        "position": 1,
        "prescription": "4 x 6 на каждую ногу",
        "coaching_note": "Контролируйте колено передней ноги по линии носка.",
    },
    {
        "workout": "leg-power",
        "exercise": "workout-cool-bench-hops",
        "position": 2,
        "prescription": "5 раундов по 20 секунд",
        "coaching_note": "Приземляйтесь мягко и сохраняйте быстрый перенос через скамью.",
    },
    {
        "workout": "tempo-run",
        "exercise": "workout-cool-bench-hops",
        "position": 1,
        "prescription": "3 x 20 секунд перед темповым блоком",
        "coaching_note": "Используйте как короткую плиометрическую активацию, не как спринт.",
    },
]


def seed_exercises(apps, schema_editor):
    Exercise = apps.get_model("api", "Exercise")
    ExerciseAttribute = apps.get_model("api", "ExerciseAttribute")
    Workout = apps.get_model("api", "Workout")
    WorkoutExercise = apps.get_model("api", "WorkoutExercise")

    exercises_by_slug = {}

    for spec in EXERCISES:
        attributes = spec["attributes"]
        exercise, _ = Exercise.objects.update_or_create(
            source_id=spec["source_id"],
            defaults={key: value for key, value in spec.items() if key != "attributes"},
        )
        exercises_by_slug[exercise.slug] = exercise
        ExerciseAttribute.objects.filter(exercise=exercise).delete()

        for name, value in attributes:
            ExerciseAttribute.objects.create(exercise=exercise, name=name, value=value)

    for link in WORKOUT_LINKS:
        workout = Workout.objects.filter(slug=link["workout"]).first()
        exercise = exercises_by_slug.get(link["exercise"])

        if workout is None or exercise is None:
            continue

        WorkoutExercise.objects.update_or_create(
            workout=workout,
            exercise=exercise,
            defaults={
                "position": link["position"],
                "prescription": link["prescription"],
                "coaching_note": link["coaching_note"],
            },
        )


def unseed_exercises(apps, schema_editor):
    Exercise = apps.get_model("api", "Exercise")
    Exercise.objects.filter(source_id__startswith="workout-cool-").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0008_exercise_catalog"),
    ]

    operations = [
        migrations.RunPython(seed_exercises, unseed_exercises),
    ]
