from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from savings.models import Savings
from transactions.models import Transaction
import decimal

class SavingsTests(APITestCase):
    def setUp(self):
        self.User = get_user_model()

        # Create two test users
        self.user1 = self.User.objects.create_user(email="user1@example.com", password="password123")
        self.user2 = self.User.objects.create_user(email="user2@example.com", password="password456")

        # Get or create Savings objects for each user and update their total_savings
        self.savings1, _ = Savings.objects.get_or_create(user=self.user1)
        self.savings1.total_savings = decimal.Decimal("50.00")
        self.savings1.save()

        self.savings2, _ = Savings.objects.get_or_create(user=self.user2)
        self.savings2.total_savings = decimal.Decimal("100.00")
        self.savings2.save()

        # Print debug statements
        print(f"User1 savings: {self.savings1.total_savings}")  # Debug
        print(f"User2 savings: {self.savings2.total_savings}")  # Debug
    
        # URL for savings API endpoint
        self.savings_url = "/savings/"

        # URL for transaction endpoint
        self.transaction_url = "/transactions/"

    def authenticate_user1(self):
        response = self.client.login(email="user1@example.com", password="password123")
        print(f"Login successful: {response}")  # Debugging line

    def test_transaction_updates_savings_with_round_up(self):
        # Authenticate user1
        self.authenticate_user1()

        # Send a POST request to create a new transaction
        transaction_data = {
            'amount': '5.75',  # Example amount
            'description': 'Test transaction',
        }

        response = self.client.post(self.transaction_url, transaction_data, format='json')

        # Assert that the response status code is 201 (created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Calculate the expected round-up (round-up function logic)
        expected_round_up = decimal.Decimal('6.00').quantize(decimal.Decimal('1.00')).to_integral_value(rounding=decimal.ROUND_UP) - decimal.Decimal('5.75')
        
        # Get the updated savings for the user
        updated_savings = Savings.objects.get(user=self.user1)

        # Assert that the total savings is updated correctly
        self.assertEqual(updated_savings.total_savings, self.savings1.total_savings + expected_round_up)

    def test_authenticated_user_can_retrieve_savings(self):
        # Authenticate user1
        self.authenticate_user1()

        # Send a GET request to retrieve savings
        response = self.client.get(self.savings_url)
        
        # Print the response data
        print(f"Response data: {response.data}")  # Debug

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the savings data is correct
        self.assertEqual(response.data["total_savings"], "50.00")

    def test_unauthenticated_user_cannot_access_savings(self):
        # Ensure no user is logged in
        self.client.logout()
        # Send a GET request without authenticating
        response = self.client.get(self.savings_url)

        # Assert that the response status code is 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

