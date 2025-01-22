from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAuthTests(APITestCase):
    def setUp(self):
        # Create a test user for login tests
        self.test_user = User.objects.create_user(
            email="testuser@example.com",
            password="password123"
        )
        self.register_url = "/api/register/"
        self.login_url = "/api/login/"

    def test_registration_success(self):
        # Test successful user registration
        data = {
            "email": "newuser@example.com",
            "password": "password123"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "User registered successfully")

    def test_registration_missing_fields(self):
        # Test registration with missing fields
        data = {
            "email": ""
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)  # Email validation error

    def test_login_success(self):
        # Test successful login
        data = {
            "email": "testuser@example.com",
            "password": "password123"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Login successful")

    def test_login_invalid_credentials(self):
        # Test login with invalid credentials
        data = {
            "email": "testuser@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Invalid credentials")

    def test_login_unregistered_user(self):
        # Test login with an unregistered email
        data = {
            "email": "unregistered@example.com",
            "password": "password123"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Invalid credentials")
