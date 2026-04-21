from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


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

    def test_schedule_returns_grouped_days(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/schedule/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["days"]), 3)
        self.assertIn("sessions", response.data["days"][0])
        self.assertIn("workout_slug", response.data["days"][0]["sessions"][0])

    def test_workouts_returns_catalog_with_phases_and_days(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/workouts/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["days"]), 3)
        self.assertEqual(len(response.data["filters"]), 3)
        self.assertGreaterEqual(len(response.data["workouts"]), 3)
        self.assertGreaterEqual(len(response.data["workouts"][0]["phases"]), 1)
