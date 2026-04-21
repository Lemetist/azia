from django.urls import path, re_path
from .views import CustomTokenObtainPairView, CustomTokenRefreshView

from . import views

try:
    from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
except ModuleNotFoundError:
    SpectacularAPIView = None
    SpectacularSwaggerView = None

urlpatterns = [
    re_path(r"^auth/register/?$", views.register, name="api-auth-register"),
    re_path(r"^auth/token/?$", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    re_path(r"^auth/token/refresh/?$", CustomTokenRefreshView.as_view(), name="token_refresh"),
    re_path(r"^auth/me/?$", views.me, name="api-auth-me"),
    re_path(r"^dashboard/summary/?$", views.dashboard_summary, name="api-dashboard-summary"),
    re_path(r"^schedule/?$", views.schedule, name="api-schedule"),
    re_path(r"^workouts/?$", views.workouts, name="api-workouts"),
    re_path(r"^echo/?$", views.echo, name="api-echo"),
]

if SpectacularAPIView is not None and SpectacularSwaggerView is not None:
    urlpatterns += [
        path("schema/", SpectacularAPIView.as_view(), name="schema"),
        path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    ]
