from django.urls import path

from . import views

urlpatterns = [
    path("auth/register/", views.register, name="api-auth-register"),
    path("auth/token/", views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", views.TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", views.me, name="api-auth-me"),
    path("echo/", views.echo, name="api-echo"),
]

