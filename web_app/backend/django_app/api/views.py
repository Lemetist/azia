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
    ScheduleResponseSerializer,
    ScheduleSessionSerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    WorkoutCatalogSerializer,
    WorkoutFilterSerializer,
    WorkoutSerializer,
    TokenObtainPairRequestSerializer,
    TokenPairResponseSerializer,
    TokenRefreshSerializer,
    TokenRefreshRequestSerializer,
    TokenRefreshResponseSerializer,
    UserSerializer,
)
from .models import ScheduleSlot, Workout, WorkoutPhase


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
    description="Получить информацию о текущем пользователе",
    responses={200: UserSerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


def _build_dashboard_summary():
    slots = list(
        ScheduleSlot.objects.select_related("coach")
        .order_by("position")[:3]
    )
    workouts_count = Workout.objects.count()

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
                "label": "Тренировок в цикле",
                "value": str(workouts_count * 3 + 3),
                "change": "+3 за неделю",
                "tone": "accent",
            },
            {
                "label": "Готовность",
                "value": "84%",
                "change": "Стабильно",
                "tone": "neutral",
            },
            {
                "label": "Посещаемость",
                "value": "91%",
                "change": "Выше цели",
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
            "week": "Неделя 12 из 16",
            "focus": "Сила и плотность недели с разгрузкой к выходным.",
            "slots_filled": f"{min(len(slots) + 1, 5)}/5",
            "readiness": "84%",
        },
    }

    return DashboardSummarySerializer(response).data


def _build_schedule_response():
    slots = list(
        ScheduleSlot.objects.select_related("coach", "workout").order_by("position")
    )

    grouped_days: list[dict] = []
    current_day_id = None
    current_group = None

    for slot in slots:
        if slot.day_id != current_day_id:
            current_day_id = slot.day_id
            current_group = {
                "day_id": slot.day_id,
                "day": slot.day,
                "date": slot.date,
                "load": slot.load,
                "sessions": [],
            }
            grouped_days.append(current_group)

        current_group["sessions"].append(
            {
                "time": slot.time,
                "title": slot.title,
                "meta": slot.meta,
                "coach": slot.coach.name,
                "spots": slot.spots,
                "status": slot.status,
                "workout_slug": slot.workout.slug,
            }
        )

    return {"days": grouped_days}


def _build_workout_catalog():
    workouts = (
        Workout.objects.prefetch_related(
            Prefetch("phases", queryset=WorkoutPhase.objects.order_by("position"))
        )
        .prefetch_related("schedule_slots")
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
def dashboard_summary(_request):
    return Response(_build_dashboard_summary())


@extend_schema(
    description="Рабочее расписание пользователя, сгруппированное по дням.",
    responses={200: ScheduleResponseSerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def schedule(_request):
    return Response(_build_schedule_response())


@extend_schema(
    description="Каталог тренировок с фазами и доступными днями расписания.",
    responses={200: WorkoutCatalogSerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def workouts(_request):
    return Response(_build_workout_catalog())




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
