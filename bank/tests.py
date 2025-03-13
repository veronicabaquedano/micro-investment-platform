from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import BankAccount

class BankAccountTests(TestCase):
    """Test cases for bank account API"""

    def setUp(self):
        """Set up test client and create a test user"""
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(email="testuser@example.com", password="testpass123")
        self.client.force_authenticate(user=self.user)  # Authenticate user

        # Sample account data
        self.bank_data = {
            "bank_name": "Test Bank",
            "account_number": "123456789",
            "routing_number": "987654321"
        }

    def test_list_bank_accounts(self):
        """Test retrieving bank accounts (should be empty at first)"""
        response = self.client.get("/bank/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # No accounts linked initially

    def test_add_bank_account(self):
        """Test adding a new bank account"""
        response = self.client.post("/bank/", self.bank_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BankAccount.objects.count(), 1)  # One account should be created

    def test_prevent_duplicate_accounts(self):
        """Test that duplicate accounts cannot be added"""
        self.client.post("/bank/", self.bank_data, format="json")  # Add first account
        response = self.client.post("/bank/", self.bank_data, format="json")  # Try adding duplicate
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(BankAccount.objects.count(), 1)  # Should still be 1

    def test_limit_to_three_accounts(self):
        """Test that a user can only add up to 5 bank accounts"""
        for i in range(5):  # Add 5 accounts
            self.client.post("/bank/", {
                "bank_name": f"Bank {i}",
                "account_number": f"12345678{i}",
                "routing_number": f"98765432{i}"
            }, format="json")
        response = self.client.post("/bank/", {  # Try adding a 6th account
            "bank_name": "Bank 6",
            "account_number": "444444444",
            "routing_number": "555555555"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(BankAccount.objects.count(), 5)  # Should still be 5

    def test_delete_bank_account(self):
        """Test deleting a bank account, allowing deletion unless it's the last one."""
        # Add two bank accounts to ensure deletion is possible
        self.client.post("/bank/", self.bank_data, format="json")
        second_account_data = {
            "bank_name": "Second Bank",
            "account_number": "222222222",
            "routing_number": "333333333"
        }
        self.client.post("/bank/", second_account_data, format="json")

        # Retrieve the list of bank accounts
        response = self.client.get("/bank/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Ensure two accounts exist

        # Delete one account (should succeed)
        account_id = response.data[0]["id"]
        delete_response = self.client.delete(f"/bank/{account_id}/")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        # Try deleting the last remaining account (should fail with 400)
        last_account_id = response.data[1]["id"]
        final_delete_response = self.client.delete(f"/bank/{last_account_id}/")
        self.assertEqual(final_delete_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_non_existent_account(self):
        """Test deleting a non-existent bank account should return 404"""
        response = self.client.delete("/bank/9999/")  # ID that doesn’t exist
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Bank account not found.", response.data["error"])

    def test_prevent_deleting_last_account(self):
        """Test that the last bank account cannot be deleted"""
        post_response = self.client.post("/bank/", self.bank_data, format="json")  # Add an account
        account_id = post_response.data["id"]

        delete_response = self.client.delete(f"/bank/{account_id}/")  # Attempt to delete last account
        self.assertEqual(delete_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You must have at least one linked bank account.", delete_response.data["error"])