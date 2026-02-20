from django.contrib import admin
from django.http import JsonResponse
from django.urls import path


def health(_request):
    return JsonResponse({"status": "ok", "service": "django"})


def root(_request):
    return JsonResponse({"message": "Django backend is running", "health": "/health/"})


urlpatterns = [
    path("", root),
    path("admin/", admin.site.urls),
    path("health/", health),
]
