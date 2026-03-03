from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def echo(request):
	return Response({"received": request.data})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
	username = request.data.get("username")
	password = request.data.get("password")
	if not username or not password:
		return Response({"detail": "username and password required"}, status=status.HTTP_400_BAD_REQUEST)

	if User.objects.filter(username=username).exists():
		return Response({"detail": "user already exists"}, status=status.HTTP_400_BAD_REQUEST)

	User.objects.create_user(username=username, password=password)
	return Response({"detail": "registered"}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
	return Response({"username": request.user.username})
