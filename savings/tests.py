# from rest_framework import status
# from rest_framework.test import APITestCase
# from django.contrib.auth import get_user_model
# from savings.models import Savings
# import decimal
# from rest_framework.test import APIClient

# class SavingsTests(APITestCase):
#     def setUp(self):
#         self.User = get_user_model()

#         # Create two test users
#         self.user1 = self.User.objects.create_user(email="user1@example.com", password="password123")
#         self.user2 = self.User.objects.create_user(email="user2@example.com", password="password456")

#         # Get or create Savings objects for each user and update their total_savings
#         self.savings1, _ = Savings.objects.get_or_create(user=self.user1)
#         self.savings1.total_savings = decimal.Decimal("50.00")
#         self.savings1.save()

#         self.savings2, _ = Savings.objects.get_or_create(user=self.user2)
#         self.savings2.total_savings = decimal.Decimal("100.00")
#         self.savings2.save()

#         # Print debug statements
#         print(f"User1 savings: {self.savings1.total_savings}")  # Debug
#         print(f"User2 savings: {self.savings2.total_savings}")  # Debug

#         # URL for savings API endpoint
#         self.savings_url = "/savings/"

#         # URL for transaction endpoint
#         self.transaction_url = "/transactions/"

#     # def authenticate_user1(self):
#     #     response = self.client.login(email="user1@example.com", password="password123")
#     #     print(f"Login successful: {response}")  # Debugging line

#     def authenticate_user1(self):
#         self.client = APIClient()  # Reinitialize the client to reset state
#         self.client.force_authenticate(user=self.user1)
#         print(f"User forced authentication: {self.user1.email}")


#     def test_transaction_updates_savings_with_round_up(self):
#         # Authenticate user1
#         self.authenticate_user1()

#         # Send a POST request to create a new transaction
#         transaction_data = {
#             'amount': '5.75',  # Example amount
#             'description': 'Test transaction',
#         }

#         response = self.client.post(self.transaction_url, transaction_data, format='json')

#         # Assert that the response status code is 201 (created)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         # Calculate the expected round-up (round-up function logic)
#         expected_round_up = decimal.Decimal('6.00').quantize(decimal.Decimal('1.00')).to_integral_value(rounding=decimal.ROUND_UP) - decimal.Decimal('5.75')

#         # Get the updated savings for the user
#         updated_savings = Savings.objects.get(user=self.user1)

#         # Assert that the total savings is updated correctly
#         self.assertEqual(updated_savings.total_savings, self.savings1.total_savings + expected_round_up)

#     def test_authenticated_user_can_retrieve_savings(self):
#         # Authenticate user1
#         self.authenticate_user1()

#         # Send a GET request to retrieve savings
#         response = self.client.get(self.savings_url)

#         # Print the response data
#         print(f"Response data: {response.data}")  # Debug

#         # Assert that the response status code is 200 (OK)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         # Assert that the savings data is correct
#         self.assertEqual(response.data["total_savings"], "50.00")


#     def test_unauthenticated_user_cannot_access_savings(self):
#         self.client.logout()  # Ensure no user is authenticated
#         self.client = APIClient()  # Reinitialize the client for a clean state
#         response = self.client.get(self.savings_url)  # Perform unauthenticated request
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


#################
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Savings
from transactions.models import Transaction
import decimal


class SavingsTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user1 = User.objects.create_user(
            email="user1@example.com", password="password"
        )

        # Create a savings account for the user
        self.savings1, _ = Savings.objects.get_or_create(user=self.user1)
        self.savings1.total_savings = decimal.Decimal("50.00")
        self.savings1.save()

        # 🔥 Use API login instead of self.client.login()
        response = self.client.post(
            "/users/login/",  # Update this if your login endpoint is different
            {"email": "user1@example.com", "password": "password"},
            format="json"
        )
        
        self.assertEqual(response.status_code, 200, f"Login failed: {response.data}")

        # 🛠 Ensure the client is authenticated using Django's session
        self.client.force_login(self.user1)  # Force login using session-based auth


    def test_round_up_on_transaction(self):
        # Send API request to create a transaction
        response = self.client.post(
            "/transactions/",
            {"amount": 5.75},
            format="json"
        )
        self.assertEqual(response.status_code, 201)  # Ensure transaction was created

        # Refresh savings after transaction processing
        self.savings1.refresh_from_db()

        # Round-up should be $0.25 (to make it $6.00)
        expected_savings = decimal.Decimal("50.00") + decimal.Decimal("0.25")
        self.assertEqual(self.savings1.total_savings, expected_savings)

    def test_multiple_transactions(self):
        # Create multiple transactions via API
        self.client.post("/transactions/", {"amount": 5.75}, format="json")  # +$0.25
        self.client.post("/transactions/", {"amount": 7.50}, format="json")  # +$0.50

        # Refresh savings after transactions
        self.savings1.refresh_from_db()

        # Total savings should be updated correctly
        expected_savings = decimal.Decimal("50.00") + decimal.Decimal("0.25") + decimal.Decimal("0.50")
        self.assertEqual(self.savings1.total_savings, expected_savings)

    def test_edge_case_transaction(self):
        # Create a transaction with an exact dollar amount (no round-up)
        response = self.client.post(
            "/transactions/",
            {"amount": 10.00},
            format="json"
        )
        self.assertEqual(response.status_code, 201)

        # Refresh savings
        self.savings1.refresh_from_db()

        # Savings should remain unchanged
        self.assertEqual(self.savings1.total_savings, decimal.Decimal("50.00"))

