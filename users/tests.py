from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAuthTests(APITestCase):
    def setUp(self):
        # Create a test user for login tests
        self.test_user = User.objects.create_user(
            email="testinguser@example.com", password="password123"
        )

        self.register_url = "/users/register/"
        self.login_url = "/users/login/"

    def test_registration_success(self):
        # Test successful user registration
        data = {"email": "newuser@example.com", "password": "password123"}
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "User created successfully.")

    def test_registration_missing_fields(self):
        # Test registration with missing fields
        data = {"email": ""}
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)  # Email validation error

    def test_login_success(self):
        # Test successful login
        data = {"email": "testinguser@example.com", "password": "password123"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Login successful")

    def test_login_invalid_credentials(self):
        # Test login with invalid credentials
        data = {"email": "testinguser@example.com", "password": "wrongpassword"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Invalid credentials")

    def test_login_unregistered_user(self):
        # Test login with an unregistered email
        data = {"email": "unregistered@example.com", "password": "password123"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Invalid credentials")

    def test_registration_duplicate_email(self):
        # Try to register with an email that already exists
        data = {
            "email": "testinguser@example.com",  # Already created in setUp()
            "password": "password123",
        }
        response = self.client.post(self.register_url, data)

        # Expect a 400 response with an email error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)  # Email field should have an error

    def test_login_case_insensitive_email(self):
        data = {
            "email": "TESTINGUSER@EXAMPLE.COM",  # Uppercase version
            "password": "password123",
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Login successful")
