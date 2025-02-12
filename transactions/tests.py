from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from transactions.models import Transaction
from savings.models import Savings


class TransactionTests(APITestCase):
    def setUp(self):
        # Create a user for testing
        self.user = User.objects.create_user(
            email="testtranuser@example.com", password="testtranpassword"
        )
        self.client.login(
            email="testtranuser@example.com", password="testtranpassword"
        )  # Log in the user
        # Ensure the user has a savings account with enough balance
        self.savings, created = Savings.objects.get_or_create(
            user=self.user, defaults={"total_savings": 500.00}
        )  # Set an initial balance
        self.savings.total_savings = 500.00  # Explicitly set balance
        self.savings.save()
        self.savings.refresh_from_db()  # Ensure latest data is used

    def test_transaction_create_and_list(self):
        # Create a transaction
        response = self.client.post(
            "/transactions/", {"amount": "200.00"}
        )  # Only include `amount`
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Ensure the transaction is created
        self.assertEqual(Transaction.objects.count(), 1)
        transaction = Transaction.objects.first()
        self.assertEqual(transaction.amount, 200.00)
        self.assertEqual(transaction.user, self.user)

        # List transactions
        response = self.client.get("/transactions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["amount"], "200.00")

    def test_transaction_negative_amount(self):
        response = self.client.post("/transactions/", {"amount": "-50.00"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("amount", response.data)  # Amount should have an error

    def test_user_cannot_access_other_users_transactions(self):
        # Create a second user
        user2 = User.objects.create_user(
            email="user2@example.com", password="password456"
        )

        # Log in as user2
        self.client.force_authenticate(user=user2)

        # Try to retrieve transactions (should be empty)
        response = self.client.get("/transactions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # No transactions should be visible

    def test_unauthenticated_user_cannot_create_transaction(self):
        """Ensure an unauthenticated user cannot create a transaction."""
        self.client.logout()
        response = self.client.post("/transactions/", {"amount": "100.00"})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
