from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .views import CustomTokenObtainPairView, CustomTokenRefreshView

from . import views

urlpatterns = [
    path("auth/register/", views.register, name="api-auth-register"),

    path("auth/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),

    path("auth/me/", views.me, name="api-auth-me"),

    path("echo/", views.echo, name="api-echo"),

    # OpenAPI schema
    path("schema/", SpectacularAPIView.as_view(), name="schema"),

    # Swagger UI
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
