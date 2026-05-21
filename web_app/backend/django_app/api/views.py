from collections import OrderedDict

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Max, Q
from rest_framework import serializers, status
from django.db.models import Prefetch
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

try:
    from drf_spectacular.types import OpenApiTypes
    from drf_spectacular.utils import (
        OpenApiExample,
        OpenApiResponse,
        extend_schema,
        extend_schema_view,
        inline_serializer,
    )
except ModuleNotFoundError:
    class OpenApiTypes:
        OBJECT = dict

    class OpenApiExample:
        def __init__(self, *args, **kwargs):
            pass

    class OpenApiResponse:
        def __init__(self, *args, **kwargs):
            pass

    def extend_schema(*args, **kwargs):
        def decorator(obj):
            return obj

        return decorator

    def extend_schema_view(**kwargs):
        def decorator(obj):
            return obj

        return decorator

    def inline_serializer(*args, **kwargs):
        return serializers.Serializer

from .serializers import (
    DashboardSummarySerializer,
    GoogleAuthSerializer,
    ScheduleBookingSerializer,
    ScheduleResponseSerializer,
    ScheduleSessionSerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    WorkoutCatalogSerializer,
    WorkoutCompletionSerializer,
    WorkoutFilterSerializer,
    WorkoutSerializer,
    UserProfileSerializer,
    UserProfileUpsertSerializer,
    TokenObtainPairRequestSerializer,
    TokenPairResponseSerializer,
    TokenRefreshSerializer,
    TokenRefreshRequestSerializer,
    TokenRefreshResponseSerializer,
    UserSerializer,
)
from .models import ScheduleBooking, ScheduleSlot, Workout, WorkoutPhase


@extend_schema(
    description="Echo endpoint для тестирования авторизации. Требует Bearer token",
    request=OpenApiTypes.OBJECT,
    responses={
        200: inline_serializer(
            name="EchoResponseSerializer",
            fields={"received": serializers.JSONField()},
        )
    },
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def echo(request):
    return Response({"received": request.data})


@extend_schema(
    request=RegisterSerializer,
    responses={201: RegisterSerializer, 400: OpenApiResponse(response={"type": "object"})},
    description="Регистрация нового пользователя. Возвращает данные пользователя.",
    examples=[
        OpenApiExample(
            "Пример запроса",
            value={
                "email": "user@example.com",
                "full_name": "Ivan Petrov",
                "password": "StrongP@ssw0rd",
            },
            request_only=True,
        )
    ],
)
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=GoogleAuthSerializer,
    responses={200: TokenPairResponseSerializer, 400: OpenApiResponse(response={"type": "object"})},
    description="Авторизация через Google ID token. Возвращает access + refresh токены приложения.",
)
@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth(request):
    serializer = GoogleAuthSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.save(), status=status.HTTP_200_OK)


@extend_schema(
    description="Получить информацию о текущем пользователе",
    responses={200: UserSerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@extend_schema(
    request=UserProfileUpsertSerializer,
    responses={200: UserProfileSerializer, 201: UserProfileSerializer},
    description="Создать или обновить анкету пользователя и пересчитать персональный план.",
)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def profile_assessment(request):
    profile = _get_user_profile(request.user)
    serializer = UserProfileUpsertSerializer(
        profile,
        data=request.data,
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    saved_profile = serializer.save()
    status_code = status.HTTP_200_OK if profile else status.HTTP_201_CREATED
    return Response(UserProfileSerializer(saved_profile).data, status=status_code)


def _get_user_profile(user):
    try:
        profile = user.profile
    except ObjectDoesNotExist:
        return None
    profile.ensure_current_plan()
    return profile


def _build_dashboard_summary(user):
    profile = _get_user_profile(user)
    slots = list(
        ScheduleSlot.objects.select_related("coach")
        .order_by("position")[:3]
    )
    workouts_count = Workout.objects.count()
    personal_plan = None

    if profile:
        personal_plan = {
            "nutrition_recommendations": profile.nutrition_recommendations,
            "daily_workout": profile.daily_workout,
        }

    next_workouts = [
        {
            "title": slot.title,
            "coach": slot.coach.name,
            "time": f"{slot.day} · {slot.time}",
            "tag": slot.status,
        }
        for slot in slots
    ]

    response = {
        "stats": [
            {
                "label": "Тренировка дня",
                "value": personal_plan["daily_workout"]["duration"] if personal_plan else str(workouts_count * 3 + 3),
                "change": personal_plan["daily_workout"]["intensity"] if personal_plan else "+3 за неделю",
                "tone": "accent",
            },
            {
                "label": "Цель",
                "value": profile.get_goal_display() if profile else "84%",
                "change": "Анкета учтена" if profile else "Стабильно",
                "tone": "neutral",
            },
            {
                "label": "Питание",
                "value": profile.nutrition_recommendations[0]["value"] if profile else "91%",
                "change": "Расчет на день" if profile else "Выше цели",
                "tone": "neutral",
            },
        ],
        "recovery_signals": [
            {"label": "Сон", "value": "7ч 48м", "status": "Хорошо"},
            {"label": "Пульс покоя", "value": "54", "status": "Ниже базы"},
            {"label": "Готовность", "value": "84%", "status": "Можно нагружать"},
        ],
        "next_workouts": next_workouts,
        "cycle_status": {
            "week": "Персональный день" if profile else "Неделя 12 из 16",
            "focus": personal_plan["daily_workout"]["focus"] if personal_plan else "Сила и плотность недели с разгрузкой к выходным.",
            "slots_filled": f"{min(len(slots) + 1, 5)}/5",
            "readiness": "84%",
        },
        "personal_plan": personal_plan,
    }

    return DashboardSummarySerializer(response).data


def _build_schedule_response(user):
    slots = list(
        ScheduleSlot.objects.select_related("coach", "workout").order_by("position")
    )
    booked_slot_ids = set(
        ScheduleBooking.objects.filter(user=user, slot__in=slots).values_list("slot_id", flat=True)
    )

    grouped_days: OrderedDict[str, dict] = OrderedDict()

    for slot in slots:
        if slot.day_id not in grouped_days:
            grouped_days[slot.day_id] = {
                "day_id": slot.day_id,
                "day": slot.day,
                "date": slot.date,
                "load": slot.load,
                "sessions": [],
            }

        grouped_days[slot.day_id]["sessions"].append(
            {
                "id": slot.id,
                "time": slot.time,
                "title": slot.title,
                "meta": slot.meta,
                "coach": slot.coach.name,
                "spots": slot.spots,
                "status": slot.status,
                "workout_slug": slot.workout.slug,
                "workout_category": slot.workout.category,
                "is_booked": slot.id in booked_slot_ids,
            }
        )

    return {"days": list(grouped_days.values())}


def _build_workout_catalog(user):
    workouts = (
        Workout.objects.prefetch_related(
            Prefetch("phases", queryset=WorkoutPhase.objects.order_by("position"))
        )
        .prefetch_related("schedule_slots")
        .annotate(
            completed_count=Count(
                "completed_sessions",
                filter=Q(completed_sessions__user=user),
            ),
            last_completed_at=Max(
                "completed_sessions__completed_at",
                filter=Q(completed_sessions__user=user),
            ),
        )
        .order_by("title")
    )
    schedule_days = list(
        ScheduleSlot.objects.order_by("position")
        .values("day_id", "day", "date")
        .distinct()
    )

    days = []
    seen_day_ids = set()
    for day in schedule_days:
        if day["day_id"] in seen_day_ids:
            continue
        seen_day_ids.add(day["day_id"])
        date_parts = day["date"].split(" ", 1)
        days.append(
            {
                "id": day["day_id"],
                "month": date_parts[1].title() if len(date_parts) > 1 else day["date"],
                "day": date_parts[0],
                "label": day["day"],
            }
        )

    serialized_workouts = WorkoutSerializer(workouts, many=True).data

    response = {
        "days": days,
        "filters": [
            {"key": "strength", "label": "Strength"},
            {"key": "cardio", "label": "Cardio"},
            {"key": "mobility", "label": "Mobility"},
        ],
        "workouts": serialized_workouts,
    }

    return response


@extend_schema(
    description="Сводка кабинета: статистика, сигналы восстановления и ближайшие тренировки.",
    responses={200: DashboardSummarySerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    return Response(_build_dashboard_summary(request.user))


@extend_schema(
    description="Рабочее расписание пользователя, сгруппированное по дням.",
    responses={200: ScheduleResponseSerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def schedule(request):
    return Response(_build_schedule_response(request.user))


@extend_schema(
    description="Записать текущего пользователя на слот расписания.",
    request=ScheduleBookingSerializer,
    responses={201: ScheduleBookingSerializer, 200: ScheduleBookingSerializer},
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def book_schedule_slot(request):
    serializer = ScheduleBookingSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    payload = serializer.save()
    status_code = status.HTTP_201_CREATED if payload["created"] else status.HTTP_200_OK
    return Response(payload, status=status_code)


@extend_schema(
    description="Каталог тренировок с фазами и доступными днями расписания.",
    responses={200: WorkoutCatalogSerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def workouts(_request):
    return Response(_build_workout_catalog(_request.user))


@extend_schema(
    description="Фиксирует выполненную тренировку и обновляет счетчик повторов.",
    request=WorkoutCompletionSerializer,
    responses={201: WorkoutCompletionSerializer},
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_workout(request):
    serializer = WorkoutCompletionSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    payload = serializer.save()
    return Response(payload, status=status.HTTP_201_CREATED)




@extend_schema_view(
    post=extend_schema(
        request=TokenObtainPairRequestSerializer,
        responses={
            200: OpenApiResponse(
                response=TokenPairResponseSerializer,
                description="Успешная авторизация",
            )
        },
        examples=[
            OpenApiExample(
                name="Пример запроса",
                value={
                    "username": "user@example.com",
                    "password": "StrongP@ssw0rd",
                },
                request_only=True,
            )
        ],
        description="Получение пары JWT (access + refresh) по username/password",
    )
)
class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


@extend_schema_view(
    post=extend_schema(
        request=TokenRefreshRequestSerializer,
        responses={200: TokenRefreshResponseSerializer},
        description="Обновление access токена по refresh токену",
    )
)
class CustomTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    serializer_class = TokenRefreshSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
