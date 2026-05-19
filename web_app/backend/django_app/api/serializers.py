from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from .models import Coach, ScheduleSlot, UserProfile, Workout, WorkoutPhase, WorkoutSession
from .tokens import (
    get_user_from_refresh_token,
    issue_access_token,
    issue_refresh_token,
)

try:
    from drf_spectacular.utils import extend_schema_field
except ModuleNotFoundError:
    def extend_schema_field(_field_type):
        def decorator(func):
            return func

        return decorator


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "password"]
        read_only_fields = ["id", "username"]

    def validate_email(self, value):
        normalized_email = value.strip().lower()

        if User.objects.filter(username__iexact=normalized_email).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")

        return normalized_email

    def create(self, validated_data):
        email = validated_data["email"]
        full_name = validated_data.pop("full_name", "").strip()
        first_name = ""
        last_name = ""

        if full_name:
            name_parts = full_name.split(maxsplit=1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=validated_data["password"],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    sex_label = serializers.CharField(source="get_sex_display", read_only=True)
    goal_label = serializers.CharField(source="get_goal_display", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "sex",
            "sex_label",
            "age",
            "height_cm",
            "weight_kg",
            "goal",
            "goal_label",
            "nutrition_recommendations",
            "daily_workout",
        ]


class UserProfileUpsertSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["sex", "age", "height_cm", "weight_kg", "goal"]
        extra_kwargs = {
            "age": {"min_value": 12, "max_value": 90},
            "height_cm": {"min_value": 120, "max_value": 230},
            "weight_kg": {"min_value": 35, "max_value": 250},
        }

    def create(self, validated_data):
        profile = UserProfile(user=self.context["request"].user, **validated_data)
        profile.regenerate_plan()
        profile.save()
        return profile

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.regenerate_plan()
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "profile"]

    @extend_schema_field(str)
    def get_full_name(self, obj):
        return obj.get_full_name().strip()

    @extend_schema_field(UserProfileSerializer)
    def get_profile(self, obj):
        try:
            profile = obj.profile
        except ObjectDoesNotExist:
            return None
        return UserProfileSerializer(profile).data


class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(trim_whitespace=False)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, attrs):
        username = attrs.get("username", "").strip()
        password = attrs.get("password", "")
        lookup_username = username

        if username:
            user = User.objects.filter(username__iexact=username).first()
            if user:
                lookup_username = user.get_username()

        authenticated_user = authenticate(username=lookup_username, password=password)
        if authenticated_user is None or not authenticated_user.is_active:
            raise serializers.ValidationError("Неверный email или пароль.")

        return {
            "access": issue_access_token(authenticated_user),
            "refresh": issue_refresh_token(authenticated_user),
        }


class TokenObtainPairRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class TokenPairResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class TokenRefreshRequestSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class TokenRefreshResponseSerializer(serializers.Serializer):
    access = serializers.CharField()


class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)

    def validate(self, attrs):
        user = get_user_from_refresh_token(attrs["refresh"])
        return {"access": issue_access_token(user)}


class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = [
            "name",
            "role",
            "focus",
            "experience",
            "availability",
            "speciality",
            "image",
        ]


class WorkoutPhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPhase
        fields = ["label", "value", "tone", "width"]


class WorkoutSerializer(serializers.ModelSerializer):
    phases = WorkoutPhaseSerializer(many=True, read_only=True)
    days = serializers.SerializerMethodField()
    completed_count = serializers.SerializerMethodField()
    last_completed_at = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = [
            "slug",
            "title",
            "category",
            "accent",
            "list_meta",
            "detail_meta",
            "description",
            "duration",
            "calories",
            "level",
            "hero_eyebrow",
            "hero_lead",
            "days",
            "phases",
            "completed_count",
            "last_completed_at",
        ]

    def get_days(self, obj):
        day_ids = (
            obj.schedule_slots.order_by("day_id", "position")
            .values_list("day_id", flat=True)
            .distinct()
        )
        return list(day_ids)

    def get_completed_count(self, obj):
        value = getattr(obj, "completed_count", None)
        if value is None:
            return 0
        return int(value)

    def get_last_completed_at(self, obj):
        value = getattr(obj, "last_completed_at", None)
        return value


class ScheduleSessionSerializer(serializers.ModelSerializer):
    coach = serializers.CharField(source="coach.name")
    workout_slug = serializers.CharField(source="workout.slug")
    workout_category = serializers.CharField(source="workout.category")

    class Meta:
        model = ScheduleSlot
        fields = [
            "time",
            "title",
            "meta",
            "coach",
            "spots",
            "status",
            "workout_slug",
            "workout_category",
        ]


class OverviewStatSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.CharField()
    change = serializers.CharField()
    tone = serializers.CharField()


class RecoverySignalSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.CharField()
    status = serializers.CharField()


class NextWorkoutSerializer(serializers.Serializer):
    title = serializers.CharField()
    coach = serializers.CharField()
    time = serializers.CharField()
    tag = serializers.CharField()


class CycleStatusSerializer(serializers.Serializer):
    week = serializers.CharField()
    focus = serializers.CharField()
    slots_filled = serializers.CharField()
    readiness = serializers.CharField()


class NutritionRecommendationSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.CharField()
    note = serializers.CharField()


class DailyWorkoutSerializer(serializers.Serializer):
    title = serializers.CharField()
    focus = serializers.CharField()
    duration = serializers.CharField()
    intensity = serializers.CharField()
    blocks = serializers.ListField(child=serializers.CharField())


class PersonalPlanSerializer(serializers.Serializer):
    nutrition_recommendations = NutritionRecommendationSerializer(many=True)
    daily_workout = DailyWorkoutSerializer()


class DashboardSummarySerializer(serializers.Serializer):
    stats = OverviewStatSerializer(many=True)
    recovery_signals = RecoverySignalSerializer(many=True)
    next_workouts = NextWorkoutSerializer(many=True)
    cycle_status = CycleStatusSerializer()
    personal_plan = PersonalPlanSerializer(allow_null=True, required=False)


class ScheduleDaySerializer(serializers.Serializer):
    day_id = serializers.CharField()
    day = serializers.CharField()
    date = serializers.CharField()
    load = serializers.CharField()
    sessions = ScheduleSessionSerializer(many=True)


class ScheduleResponseSerializer(serializers.Serializer):
    days = ScheduleDaySerializer(many=True)


class WorkoutDaySerializer(serializers.Serializer):
    id = serializers.CharField()
    month = serializers.CharField()
    day = serializers.CharField()
    label = serializers.CharField()


class WorkoutFilterSerializer(serializers.Serializer):
    key = serializers.CharField()
    label = serializers.CharField()


class WorkoutCatalogSerializer(serializers.Serializer):
    days = WorkoutDaySerializer(many=True)
    filters = WorkoutFilterSerializer(many=True)
    workouts = WorkoutSerializer(many=True)


class WorkoutCompletionSerializer(serializers.Serializer):
    workout_slug = serializers.SlugField()
    elapsed_seconds = serializers.IntegerField(min_value=1, write_only=True)
    completed_count = serializers.IntegerField(read_only=True)
    last_completed_at = serializers.DateTimeField(read_only=True)

    def validate_workout_slug(self, value):
        workout = Workout.objects.filter(slug=value).first()
        if workout is None:
            raise serializers.ValidationError("Тренировка не найдена.")
        self.context["workout"] = workout
        return value

    def create(self, validated_data):
        user = self.context["request"].user
        workout = self.context["workout"]
        elapsed_seconds = validated_data["elapsed_seconds"]

        session = WorkoutSession.objects.create(
            user=user,
            workout=workout,
            elapsed_seconds=elapsed_seconds,
        )
        completed_count = WorkoutSession.objects.filter(user=user, workout=workout).count()
        return {
            "workout_slug": workout.slug,
            "completed_count": completed_count,
            "last_completed_at": session.completed_at,
        }
