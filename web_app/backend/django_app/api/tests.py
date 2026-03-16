from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthApiTests(APITestCase):
    def test_register_uses_email_as_username_and_stores_full_name(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "TestUser@Example.com",
                "full_name": "Ivan Petrov",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "testuser@example.com")
        self.assertEqual(response.data["username"], "testuser@example.com")

        user = User.objects.get(username="testuser@example.com")
        self.assertEqual(user.email, "testuser@example.com")
        self.assertEqual(user.first_name, "Ivan")
        self.assertEqual(user.last_name, "Petrov")

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(
            username="testuser@example.com",
            email="testuser@example.com",
            password="strongpass123",
        )

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
        user = User.objects.create_user(
            username="testuser@example.com",
            email="testuser@example.com",
            first_name="Ivan",
            last_name="Petrov",
            password="strongpass123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                "id": user.id,
                "username": "testuser@example.com",
                "email": "testuser@example.com",
                "full_name": "Ivan Petrov",
            },
        )

    def test_token_endpoint_accepts_email_with_different_case(self):
        User.objects.create_user(
            username="testuser@example.com",
            email="testuser@example.com",
            password="strongpass123",
        )

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
