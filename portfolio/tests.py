from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Investment
from savings.models import Savings  # Ensure savings exist before allocation
import decimal

class PortfolioTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        # Create a test user
        self.user = User.objects.create_user(email="user@example.com", password="password")

        # Create Savings object for user
        self.savings = Savings.objects.create(user=self.user, total_savings=decimal.Decimal("100.00"))

        # Log in the user
        self.client.login(email="user@example.com", password="password")

    def test_create_investment(self):
        """Test allocating savings to a portfolio."""
        data = {
            "portfolio_name": "Tech Growth Fund",
            "allocated_amount": 50.00
        }
        response = self.client.post("/portfolio/", data)

        # Check if allocation was successful
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Investment.objects.count(), 1)
        investment = Investment.objects.first()
        self.assertEqual(investment.allocated_amount, 50.00)

    def test_get_investments(self):
        """Test retrieving the user's portfolio allocations."""
        # Create an investment first
        Investment.objects.create(user=self.user, portfolio_name="Tech Growth Fund", allocated_amount=50.00)

        response = self.client.get("/portfolio/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # Ensure one investment is returned
        self.assertEqual(response.data[0]["portfolio_name"], "Tech Growth Fund")
