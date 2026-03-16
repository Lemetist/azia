from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)

from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


@extend_schema(
    description="Echo endpoint для тестирования авторизации. Требует Bearer token",
    request={"type": "object"},
    responses={200: OpenApiResponse(response={"type": "object"})},
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


# Документируем стандартные вьюхи simplejwt для более понятной схемы в Swagger/UI

@extend_schema(
    request={
        "type": "object",
        "properties": {
            "username": {"type": "string"},
            "password": {"type": "string"},
        },
    },
    responses={
        200: OpenApiResponse(
            response={
                "type": "object",
                "properties": {
                    "access": {"type": "string"},
                    "refresh": {"type": "string"},
                },
            }
        )
    },
    description="Получение пары JWT (access + refresh) по username/password",
)
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Обёртка над TokenObtainPairView с аннотацией схемы.
    В urls.py можно подключать эту вьюху вместо стандартной, если хотите,
    чтобы в документации отображалась подробная схема запроса/ответа.
    """
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(
    request={
        "type": "object",
        "properties": {
            "refresh": {"type": "string"},
        },
    },
    responses={
        200: OpenApiResponse(
            response={
                "type": "object",
                "properties": {
                    "access": {"type": "string"},
                },
            }
        )
    },
    description="Обновление access токена по refresh токену",
)
class CustomTokenRefreshView(TokenRefreshView):
    """
    Обёртка над TokenRefreshView с аннотацией схемы.
    """
    pass
