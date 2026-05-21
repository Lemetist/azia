from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


def build_personal_recommendations(
    *,
    sex: str,
    age: int,
    height_cm: float,
    weight_kg: float,
    goal: str,
) -> dict:
    sex_adjustment = 5 if sex == UserProfile.Sex.MALE else -161 if sex == UserProfile.Sex.FEMALE else -78
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + sex_adjustment
    activity_multiplier = 1.42 if age >= 50 else 1.5
    maintenance_calories = round(bmr * activity_multiplier)
    bmi = weight_kg / (height_cm / 100) ** 2
    water_liters = round(max(1.8, min(4.2, weight_kg * 0.035)), 1)
    recovery_note = (
        "держите запас 2-3 повтора и избегайте ударного кардио"
        if age >= 50 or bmi >= 30
        else "работайте с запасом 1-2 повтора и контролируйте технику"
    )

    goal_settings = {
        UserProfile.Goal.FAT_LOSS: {
            "calorie_factor": 0.82 if bmi >= 27 else 0.88,
            "protein_multiplier": 2.0,
            "fat_multiplier": 0.8,
            "tempo": "снижение 0.4-0.7% веса в неделю",
            "carb_timing": "основные углеводы оставьте на завтрак и прием после тренировки",
            "workout_title": "Силовой круг + низкоинтенсивное кардио",
            "workout_focus": "сохранить мышцы и повысить дневной расход энергии",
            "intensity": "Средняя",
            "duration": "48 минут",
            "blocks": [
                "Разминка: 7 минут ходьбы, мобилизация голеностопа, бедра и грудного отдела",
                "Сила: 3 круга по 10 приседаний к лавке, 10 тяг блока, 8 отжиманий от опоры, 30 секунд планки",
                "Ноги и корпус: 3 подхода по 12 ягодичных мостов и 10 dead bug на сторону",
                "Кардио: 18 минут ходьбы на дорожке или велотренажера в зоне 2, дыхание без закисления",
                f"Контроль: {recovery_note}; если пульс резко растет, уберите один круг",
            ],
        },
        UserProfile.Goal.MUSCLE_GAIN: {
            "calorie_factor": 1.08,
            "protein_multiplier": 1.8,
            "fat_multiplier": 0.9,
            "tempo": "рост веса 0.2-0.4% в неделю без резкого набора жира",
            "carb_timing": "половину углеводов поставьте в прием до и после тренировки",
            "workout_title": "Гипертрофия всего тела",
            "workout_focus": "дать мышцам достаточный объем без перегруза суставов",
            "intensity": "Выше средней",
            "duration": "55 минут",
            "blocks": [
                "Разминка: 8 минут мобилити плеч и бедра, затем 2 легких разминочных подхода",
                "База: 4 подхода по 6-8 приседаний или жима ногами с паузой 2 минуты",
                "Верх тела: 4 подхода по 8 жима гантелей и 4 подхода по 10 горизонтальной тяги",
                "Добор: 3 подхода по 10 румынской тяги и 12 подъемов на пресс",
                f"Контроль: {recovery_note}; последний подход тяжелый, но без отказа",
            ],
        },
        UserProfile.Goal.ENDURANCE: {
            "calorie_factor": 1.04,
            "protein_multiplier": 1.6,
            "fat_multiplier": 0.8,
            "tempo": "поддерживать вес и повышать недельный объем без провала восстановления",
            "carb_timing": "за 60-90 минут до тренировки добавьте 40-60 г углеводов",
            "workout_title": "Темповая выносливость",
            "workout_focus": "улучшить аэробную базу и устойчивость к темпу",
            "intensity": "Средняя",
            "duration": "50 минут",
            "blocks": [
                "Разминка: 10 минут легкого бега, эллипса или велосипеда до комфортного пульса",
                "Темп: 5 отрезков по 3 минуты бодро, между ними 2 минуты очень легко",
                "Стабилизация: 3 подхода по 12 выпадов назад и 12 тяг резинки к корпусу",
                "Заминка: 8-10 минут спокойного кардио и растяжка икр, ягодиц, сгибателей бедра",
                f"Контроль: {recovery_note}; темп должен быть устойчивым, не спринтерским",
            ],
        },
        UserProfile.Goal.WELLNESS: {
            "calorie_factor": 1.0,
            "protein_multiplier": 1.6,
            "fat_multiplier": 0.9,
            "tempo": "стабильная энергия, сон и регулярность без жестких ограничений",
            "carb_timing": "распределите углеводы равномерно, без больших вечерних доборов",
            "workout_title": "Мобилити + базовая сила",
            "workout_focus": "поддержать тонус, осанку и самочувствие",
            "intensity": "Легкая",
            "duration": "42 минуты",
            "blocks": [
                "Разминка: 6 минут дыхания, кошка-корова, раскрытие грудного отдела и тазобедренных",
                "Сила: 3 подхода по 10 приседаний к лавке, 10 тяг резинки, 12 ягодичных мостов",
                "Корпус: 3 подхода по 8 dead bug на сторону и 25 секунд боковой планки",
                "Кардио: 12 минут спокойной ходьбы с носовым дыханием",
                f"Контроль: {recovery_note}; задача дня - выйти бодрее, чем начали",
            ],
        },
        UserProfile.Goal.RECOMPOSITION: {
            "calorie_factor": 0.95,
            "protein_multiplier": 2.0,
            "fat_multiplier": 0.8,
            "tempo": "вес может стоять, но объемы и силовые должны постепенно улучшаться",
            "carb_timing": "углеводы держите вокруг тренировки, белок распределите равномерно",
            "workout_title": "Сила + короткий метаболический блок",
            "workout_focus": "удержать силовой прогресс и постепенно менять состав тела",
            "intensity": "Средняя",
            "duration": "52 минуты",
            "blocks": [
                "Разминка: 8 минут мобилизации бедра, плеч и 2 подготовительных подхода первого упражнения",
                "Сила: 4 подхода по 6 приседаний или жима ногами, отдых 2 минуты",
                "Верх тела: 4 подхода по 8 жима гантелей и 4 подхода по 10 тяги блока",
                "Финиш: 8 минут интервальной гребли или шага 40 секунд работа / 20 секунд легко",
                f"Контроль: {recovery_note}; прогрессируйте вес только при чистой технике",
            ],
        },
    }
    selected_goal = goal_settings[goal]
    target_calories = round(maintenance_calories * selected_goal["calorie_factor"])
    calorie_floor = 1500 if sex == UserProfile.Sex.FEMALE else 1700
    target_calories = max(calorie_floor, target_calories)
    protein = round(weight_kg * selected_goal["protein_multiplier"])
    fats = round(weight_kg * selected_goal["fat_multiplier"])
    remaining_calories = target_calories - protein * 4 - fats * 9
    carbs = max(90, round(remaining_calories / 4))
    calories_from_macros = protein * 4 + carbs * 4 + fats * 9
    meal_protein = round(protein / 4)

    return {
        "nutrition_recommendations": [
            {
                "label": "Калории и темп",
                "value": f"{target_calories} ккал",
                "note": (
                    f"Поддержка около {maintenance_calories} ккал, BMR {round(bmr)} ккал. "
                    f"Цель: {selected_goal['tempo']}."
                ),
            },
            {
                "label": "Белок",
                "value": f"{protein} г/день",
                "note": f"Ориентир: 4 приема по {meal_protein} г белка. Подойдут яйца, рыба, курица, творог, бобовые или протеин.",
            },
            {
                "label": "Углеводы и жиры",
                "value": f"{carbs} г углеводов · {fats} г жиров",
                "note": f"{selected_goal['carb_timing']}. Макросы дают примерно {calories_from_macros} ккал, это нормально близко к цели.",
            },
            {
                "label": "Тарелка на день",
                "value": "3 приема + 1 перекус",
                "note": "В каждом основном приеме: ладонь белка, кулак крупы или картофеля, 2 кулака овощей, 1-2 больших пальца жиров.",
            },
            {
                "label": "Вода и контроль",
                "value": f"{water_liters} л воды",
                "note": f"BMI сейчас {bmi:.1f}. Сверяйте средний вес и самочувствие раз в 7 дней, корректируйте калории на 100-150 ккал.",
            },
        ],
        "daily_workout": {
            "title": selected_goal["workout_title"],
            "focus": selected_goal["workout_focus"],
            "duration": selected_goal["duration"],
            "intensity": selected_goal["intensity"],
            "blocks": selected_goal["blocks"],
        },
    }


class UserProfile(models.Model):
    class Sex(models.TextChoices):
        MALE = "male", "Мужской"
        FEMALE = "female", "Женский"
        OTHER = "other", "Другой"

    class Goal(models.TextChoices):
        FAT_LOSS = "fat_loss", "Снижение веса"
        MUSCLE_GAIN = "muscle_gain", "Набор мышц"
        ENDURANCE = "endurance", "Выносливость"
        WELLNESS = "wellness", "Здоровье и тонус"
        RECOMPOSITION = "recomposition", "Рекомпозиция"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    sex = models.CharField(max_length=16, choices=Sex.choices)
    age = models.PositiveSmallIntegerField(validators=[MinValueValidator(12), MaxValueValidator(90)])
    height_cm = models.DecimalField(max_digits=5, decimal_places=1)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=1)
    goal = models.CharField(max_length=24, choices=Goal.choices)
    nutrition_recommendations = models.JSONField(default=list, blank=True)
    daily_workout = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["user_id"]

    def regenerate_plan(self) -> None:
        recommendations = build_personal_recommendations(
            sex=self.sex,
            age=self.age,
            height_cm=float(self.height_cm),
            weight_kg=float(self.weight_kg),
            goal=self.goal,
        )
        self.nutrition_recommendations = recommendations["nutrition_recommendations"]
        self.daily_workout = recommendations["daily_workout"]

    def has_current_plan(self) -> bool:
        if not self.nutrition_recommendations or not self.daily_workout:
            return False

        first_recommendation = self.nutrition_recommendations[0]
        return (
            isinstance(first_recommendation, dict)
            and first_recommendation.get("label") == "Калории и темп"
            and len(self.nutrition_recommendations) >= 5
        )

    def ensure_current_plan(self) -> None:
        if self.has_current_plan():
            return

        self.regenerate_plan()
        self.save(update_fields=["nutrition_recommendations", "daily_workout", "updated_at"])

    def save(self, *args, **kwargs):
        if not self.nutrition_recommendations or not self.daily_workout:
            self.regenerate_plan()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.user} profile"


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


class Exercise(models.Model):
    source_id = models.CharField(max_length=80, unique=True)
    name = models.CharField(max_length=160)
    name_en = models.CharField(max_length=160, blank=True)
    slug = models.SlugField(unique=True)
    slug_en = models.SlugField(blank=True, null=True, unique=True)
    description = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    introduction = models.TextField(blank=True)
    introduction_en = models.TextField(blank=True)
    video_url = models.URLField(blank=True, max_length=500)
    image_url = models.URLField(blank=True, max_length=500)

    class Meta:
        ordering = ["name_en", "name"]

    def __str__(self) -> str:
        return self.name_en or self.name


class ExerciseAttribute(models.Model):
    class Name(models.TextChoices):
        TYPE = "TYPE", "Type"
        PRIMARY_MUSCLE = "PRIMARY_MUSCLE", "Primary muscle"
        SECONDARY_MUSCLE = "SECONDARY_MUSCLE", "Secondary muscle"
        EQUIPMENT = "EQUIPMENT", "Equipment"
        MECHANICS_TYPE = "MECHANICS_TYPE", "Mechanics type"

    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="attributes",
    )
    name = models.CharField(max_length=32, choices=Name.choices)
    value = models.CharField(max_length=64)

    class Meta:
        ordering = ["name", "value", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["exercise", "name", "value"],
                name="api_unique_exercise_attribute",
            )
        ]

    def __str__(self) -> str:
        return f"{self.exercise}: {self.name}={self.value}"


class WorkoutExercise(models.Model):
    workout = models.ForeignKey(
        Workout,
        on_delete=models.CASCADE,
        related_name="exercise_links",
    )
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="workout_links",
    )
    prescription = models.CharField(max_length=120)
    coaching_note = models.CharField(max_length=255, blank=True)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["workout", "exercise"],
                name="api_unique_workout_exercise",
            )
        ]

    def __str__(self) -> str:
        return f"{self.workout}: {self.exercise}"


class WorkoutSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workout_sessions",
    )
    workout = models.ForeignKey(
        Workout,
        on_delete=models.CASCADE,
        related_name="completed_sessions",
    )
    elapsed_seconds = models.PositiveIntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-completed_at", "-id"]
        indexes = [
            models.Index(fields=["user", "workout", "-completed_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user} · {self.workout} · {self.completed_at:%Y-%m-%d %H:%M}"


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


class ScheduleBooking(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="schedule_bookings",
    )
    slot = models.ForeignKey(
        ScheduleSlot,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "slot"],
                name="unique_schedule_booking_per_user_slot",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "slot"], name="api_schedul_user_id_279972_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.user} · {self.slot}"
