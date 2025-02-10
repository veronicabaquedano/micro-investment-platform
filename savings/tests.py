from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from savings.models import Savings
import decimal
from rest_framework.test import APIClient


class SavingsTests(APITestCase):
    def setUp(self):
        self.User = get_user_model()

        # Create two test users
        self.user1 = self.User.objects.create_user(
            email="user1@example.com", password="password123"
        )
        self.user2 = self.User.objects.create_user(
            email="user2@example.com", password="password456"
        )

        # Get or create Savings objects for each user and update their total_savings
        self.savings1, _ = Savings.objects.get_or_create(user=self.user1)
        self.savings1.total_savings = decimal.Decimal("50.00")
        self.savings1.save()

        self.savings2, _ = Savings.objects.get_or_create(user=self.user2)
        self.savings2.total_savings = decimal.Decimal("100.00")
        self.savings2.save()

        # URL for savings API endpoint
        self.savings_url = "/savings/"

        # URL for transaction endpoint
        self.transaction_url = "/transactions/"

    def authenticate_user1(self):
        self.client.force_authenticate(
            user=self.user1
        )  # Ensure requests are authenticated

    def test_transaction_updates_savings_with_round_up(self):
        self.authenticate_user1()  # Ensure authentication

        transaction_data = {
            "amount": "5.75",
            "description": "Test transaction",
            # Don't manually include 'user' in request, API should assign it automatically
        }

        response = self.client.post(
            self.transaction_url, transaction_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Calculate expected round-up
        expected_round_up = decimal.Decimal("6.00") - decimal.Decimal("5.75")

        # Get updated savings
        updated_savings = Savings.objects.get(user=self.user1)

        # Assert savings increased correctly
        self.assertEqual(
            updated_savings.total_savings,
            self.savings1.total_savings + expected_round_up,
        )

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
        self.client.logout()  # Ensure no user is authenticated
        self.client = APIClient()  # Reinitialize the client for a clean state
        response = self.client.get(self.savings_url)  # Perform unauthenticated request
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_transaction_does_not_reduce_savings_below_zero(self):
        self.authenticate_user1()  # Ensure authentication

        transaction_data = {"amount": "60.00"}  # User only has $50 in savings

        response = self.client.post(
            self.transaction_url, transaction_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check that the correct error message is returned
        self.assertIn("non_field_errors", response.data)
        self.assertIn(
            "Insufficient savings for this transaction.",
            response.data["non_field_errors"],
        )

    def test_round_up_on_transaction(self):
        self.authenticate_user1()

        response = self.client.post(
            self.transaction_url, {"amount": 5.75}, format="json"
        )
        self.assertEqual(response.status_code, 201)

        self.savings1.refresh_from_db()
        expected_savings = decimal.Decimal("50.00") + decimal.Decimal("0.25")
        self.assertEqual(self.savings1.total_savings, expected_savings)

    def test_multiple_transactions(self):
        self.authenticate_user1()

        self.client.post(
            self.transaction_url, {"amount": 5.75}, format="json"
        )  # +$0.25
        self.client.post(
            self.transaction_url, {"amount": 7.50}, format="json"
        )  # +$0.50

        self.savings1.refresh_from_db()

        expected_savings = (
            decimal.Decimal("50.00") + decimal.Decimal("0.25") + decimal.Decimal("0.50")
        )
        self.assertEqual(self.savings1.total_savings, expected_savings)

    def test_edge_case_transaction(self):
        self.authenticate_user1()

        response = self.client.post(
            self.transaction_url, {"amount": 10.00}, format="json"
        )
        self.assertEqual(response.status_code, 201)

        self.savings1.refresh_from_db()

        # Since it's an exact amount, savings should not change
        self.assertEqual(self.savings1.total_savings, decimal.Decimal("50.00"))

    def test_unauthenticated_user_cannot_update_savings(self):
        """Ensure an unauthenticated user cannot modify savings data."""
        self.client.logout()
        response = self.client.patch("/savings/", {"total_savings": "1000.00"})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
