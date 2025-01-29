from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from savings.models import Savings

class SavingsTests(APITestCase):
    def setUp(self):
        self.User = get_user_model()
        # Create two test users
        self.user1 = self.User.objects.create_user(email="user1@example.com", password="password123")
        self.user2 = self.User.objects.create_user(email="user2@example.com", password="password456")

        # Create savings entries for both users
        self.savings1 = Savings.objects.create(user=self.user1, total_savings=50.00)
        self.savings2 = Savings.objects.create(user=self.user2, total_savings=75.00)

        # URL for savings API endpoint
        self.savings_url = "/savings/"

    def authenticate_user1(self):
        self.client.login(email="user1@example.com", password="password123")

    def test_authenticated_user_can_retrieve_savings(self):
        # Authenticate user1
        self.authenticate_user1()

        # Send a GET request to retrieve savings
        response = self.client.get(self.savings_url)

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the savings data is correct
        self.assertEqual(response.data["total_savings"], "50.00")

    def test_unauthenticated_user_cannot_access_savings(self):
        # Send a GET request without authenticating
        response = self.client.get(self.savings_url)

        # Assert that the response status code is 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
