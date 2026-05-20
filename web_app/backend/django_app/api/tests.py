from django.contrib.auth.models import User
from django.contrib import admin
from django.test import Client, override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

from .models import (
    Coach,
    ScheduleBooking,
    ScheduleSlot,
    UserProfile,
    Workout,
    WorkoutPhase,
    WorkoutSession,
)


class AdminConfigurationTests(APITestCase):
    def setUp(self):
        super().setUp()
        self.admin_user = User.objects.create_superuser(
            username="admin@example.com",
            email="admin@example.com",
            password="strongpass123",
        )
        self.admin_client = Client()
        self.admin_client.force_login(self.admin_user)

    def test_domain_models_are_registered_in_admin(self):
        for model in (
            UserProfile,
            Coach,
            Workout,
            WorkoutPhase,
            ScheduleSlot,
            ScheduleBooking,
            WorkoutSession,
        ):
            self.assertIn(model, admin.site._registry)

    def test_user_admin_includes_profile_inline(self):
        user_admin = admin.site._registry[User]

        self.assertTrue(
            any(inline.model is UserProfile for inline in user_admin.inlines)
        )

    def test_domain_admin_changelists_render(self):
        for model in (
            UserProfile,
            Coach,
            Workout,
            WorkoutPhase,
            ScheduleSlot,
            ScheduleBooking,
            WorkoutSession,
        ):
            opts = model._meta
            response = self.admin_client.get(
                f"/admin/{opts.app_label}/{opts.model_name}/"
            )

            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schedule_slot_admin_shows_booked_members(self):
        member = User.objects.create_user(
            username="member@example.com",
            email="member@example.com",
            first_name="Ivan",
            last_name="Member",
            password="strongpass123",
        )
        slot = ScheduleSlot.objects.first()
        ScheduleBooking.objects.create(user=member, slot=slot)

        changelist_response = self.admin_client.get("/admin/api/scheduleslot/")
        change_response = self.admin_client.get(
            f"/admin/api/scheduleslot/{slot.pk}/change/"
        )

        self.assertContains(changelist_response, "Ivan Member")
        self.assertContains(change_response, "Ivan Member")
        self.assertContains(change_response, "member@example.com")


class AuthApiTests(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            username="testuser@example.com",
            email="testuser@example.com",
            first_name="Ivan",
            last_name="Petrov",
            password="strongpass123",
        )

    def profile_payload(self):
        return {
            "sex": "male",
            "age": 32,
            "height_cm": "182.0",
            "weight_kg": "84.0",
            "goal": "recomposition",
        }

    def test_register_accepts_post_without_trailing_slash(self):
        response = self.client.post(
            "/api/auth/register",
            {
                "email": "noslash@example.com",
                "full_name": "No Slash",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "noslash@example.com")
        self.assertTrue(User.objects.filter(username="noslash@example.com").exists())

    def test_token_accepts_post_without_trailing_slash(self):
        response = self.client.post(
            "/api/auth/token",
            {
                "username": "testuser@example.com",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_register_uses_email_as_username_and_stores_full_name(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "NewUser@Example.com",
                "full_name": "Ivan Petrov",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "newuser@example.com")
        self.assertEqual(response.data["username"], "newuser@example.com")

        user = User.objects.get(username="newuser@example.com")
        self.assertEqual(user.email, "newuser@example.com")
        self.assertEqual(user.first_name, "Ivan")
        self.assertEqual(user.last_name, "Petrov")
        self.assertFalse(hasattr(user, "profile"))

    def test_profile_assessment_creates_profile_and_plan(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put("/api/auth/profile/", self.profile_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["goal"], "recomposition")
        self.assertEqual(response.data["goal_label"], "Рекомпозиция")
        self.assertEqual(response.data["nutrition_recommendations"][0]["label"], "Калории и темп")
        self.assertGreaterEqual(len(response.data["nutrition_recommendations"]), 5)
        self.assertEqual(response.data["daily_workout"]["title"], "Сила + короткий метаболический блок")

    def test_profile_assessment_requires_valid_payload(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            "/api/auth/profile/",
            {
                "sex": "male",
                "age": 8,
                "height_cm": "80.0",
                "weight_kg": "20.0",
                "goal": "recomposition",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.put(
            "/api/auth/profile/",
            {
                "sex": "male",
                "age": 8,
                "height_cm": "80.0",
                "weight_kg": "20.0",
                "goal": "recomposition",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("age", response.data)
        self.assertIn("height_cm", response.data)
        self.assertIn("weight_kg", response.data)

    def test_register_rejects_duplicate_email(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "testuser@example.com",
                "full_name": "Ivan Petrov",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["email"][0],
            "Пользователь с таким email уже существует.",
        )

    def test_me_returns_email_and_full_name_for_authenticated_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                "id": self.user.id,
                "username": "testuser@example.com",
                "email": "testuser@example.com",
                "full_name": "Ivan Petrov",
                "profile": None,
            },
        )

    def test_token_endpoint_accepts_email_with_different_case(self):
        response = self.client.post(
            "/api/auth/token/",
            {
                "username": "TestUser@Example.com",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_token_returns_russian_error_for_invalid_credentials(self):
        response = self.client.post(
            "/api/auth/token/",
            {
                "username": "missing@example.com",
                "password": "wrongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["non_field_errors"][0], "Неверный email или пароль.")

    def test_me_accepts_bearer_token_from_token_endpoint(self):
        token_response = self.client.post(
            "/api/auth/token/",
            {
                "username": "testuser@example.com",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(token_response.status_code, status.HTTP_200_OK)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_response.data['access']}")
        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "testuser@example.com")
        self.assertEqual(response.data["full_name"], "Ivan Petrov")
        self.assertIsNone(response.data["profile"])

    def test_refresh_endpoint_returns_new_access_token(self):
        token_response = self.client.post(
            "/api/auth/token/",
            {
                "username": "testuser@example.com",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(token_response.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post(
            "/api/auth/token/refresh/",
            {"refresh": token_response.data["refresh"]},
            format="json",
        )

        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)

    def test_dashboard_summary_requires_authentication(self):
        response = self.client.get("/api/dashboard/summary/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_summary_returns_real_data(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/dashboard/summary/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["stats"]), 3)
        self.assertGreaterEqual(len(response.data["next_workouts"]), 1)
        self.assertEqual(response.data["cycle_status"]["week"], "Неделя 12 из 16")
        self.assertIsNone(response.data["personal_plan"])

    def test_dashboard_summary_returns_personal_plan_for_profile(self):
        user = User.objects.create_user(
            username="profile@example.com",
            email="profile@example.com",
            password="strongpass123",
        )
        self.client.force_authenticate(user=user)
        profile_response = self.client.put("/api/auth/profile/", self.profile_payload(), format="json")
        self.assertEqual(profile_response.status_code, status.HTTP_201_CREATED)

        self.client.force_authenticate(user=user)

        response = self.client.get("/api/dashboard/summary/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["cycle_status"]["week"], "Персональный день")
        self.assertEqual(
            response.data["personal_plan"]["daily_workout"]["title"],
            "Сила + короткий метаболический блок",
        )
        self.assertEqual(response.data["personal_plan"]["nutrition_recommendations"][0]["label"], "Калории и темп")

    def test_schedule_returns_grouped_days(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/schedule/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["days"]), 7)
        self.assertIn("sessions", response.data["days"][0])
        self.assertIn("id", response.data["days"][0]["sessions"][0])
        self.assertIn("workout_slug", response.data["days"][0]["sessions"][0])
        self.assertIn("workout_category", response.data["days"][0]["sessions"][0])
        self.assertIn("is_booked", response.data["days"][0]["sessions"][0])

    def test_book_schedule_slot_creates_booking_and_marks_schedule(self):
        self.client.force_authenticate(user=self.user)
        schedule_response = self.client.get("/api/schedule/")
        slot_id = schedule_response.data["days"][0]["sessions"][0]["id"]

        booking_response = self.client.post(
            "/api/schedule/book/",
            {"slot_id": slot_id},
            format="json",
        )

        self.assertEqual(booking_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(booking_response.data["slot_id"], slot_id)
        self.assertTrue(booking_response.data["is_booked"])
        self.assertEqual(ScheduleBooking.objects.filter(user=self.user, slot_id=slot_id).count(), 1)

        updated_schedule = self.client.get("/api/schedule/")
        booked_session = next(
            session
            for day in updated_schedule.data["days"]
            for session in day["sessions"]
            if session["id"] == slot_id
        )
        self.assertTrue(booked_session["is_booked"])

    def test_book_schedule_slot_is_idempotent_for_same_user(self):
        self.client.force_authenticate(user=self.user)
        schedule_response = self.client.get("/api/schedule/")
        slot_id = schedule_response.data["days"][0]["sessions"][0]["id"]

        first_response = self.client.post(
            "/api/schedule/book/",
            {"slot_id": slot_id},
            format="json",
        )
        second_response = self.client.post(
            "/api/schedule/book/",
            {"slot_id": slot_id},
            format="json",
        )

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertFalse(second_response.data["created"])
        self.assertEqual(ScheduleBooking.objects.filter(user=self.user, slot_id=slot_id).count(), 1)

    def test_workouts_returns_catalog_with_phases_and_days(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/workouts/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["days"]), 3)
        self.assertEqual(len(response.data["filters"]), 3)
        self.assertGreaterEqual(len(response.data["workouts"]), 3)
        self.assertGreaterEqual(len(response.data["workouts"][0]["phases"]), 1)
        self.assertIn("completed_count", response.data["workouts"][0])
        self.assertIn("last_completed_at", response.data["workouts"][0])

    def test_complete_workout_creates_session_and_returns_repeat_count(self):
        self.client.force_authenticate(user=self.user)
        catalog = self.client.get("/api/workouts/")
        workout_slug = catalog.data["workouts"][0]["slug"]

        first_response = self.client.post(
            "/api/workouts/complete/",
            {"workout_slug": workout_slug, "elapsed_seconds": 900},
            format="json",
        )
        second_response = self.client.post(
            "/api/workouts/complete/",
            {"workout_slug": workout_slug, "elapsed_seconds": 880},
            format="json",
        )

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(first_response.data["completed_count"], 1)
        self.assertEqual(second_response.data["completed_count"], 2)
        self.assertEqual(
            WorkoutSession.objects.filter(user=self.user, workout__slug=workout_slug).count(),
            2,
        )

    def test_workouts_catalog_includes_user_repeat_stats(self):
        self.client.force_authenticate(user=self.user)
        catalog = self.client.get("/api/workouts/")
        workout_slug = catalog.data["workouts"][0]["slug"]

        self.client.post(
            "/api/workouts/complete/",
            {"workout_slug": workout_slug, "elapsed_seconds": 760},
            format="json",
        )

        updated_catalog = self.client.get("/api/workouts/")
        updated_workout = next(
            item for item in updated_catalog.data["workouts"] if item["slug"] == workout_slug
        )

        self.assertEqual(updated_workout["completed_count"], 1)
        self.assertIsNotNone(updated_workout["last_completed_at"])
