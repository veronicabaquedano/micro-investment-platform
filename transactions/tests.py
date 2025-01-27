from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from transactions.models import Transaction


class TransactionTests(APITestCase):
    def setUp(self):
        # Create a user for testing
        self.user = User.objects.create_user(email="testtranuser@example.com", password="testtranpassword")
        self.client.login(email="testtranuser@example.com", password="testtranpassword")  # Log in the user

    def test_transaction_create_and_list(self):
        # Create a transaction
        response = self.client.post("/transactions/", {"amount": "200.00"})  # Only include `amount`
        print(response.status_code, response.data)  # Debugging output
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
