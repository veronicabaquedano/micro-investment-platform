from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Investment
from savings.models import Savings  # Ensure savings exist before allocation
from decimal import Decimal

User = get_user_model()

class PortfolioTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@example.com", password="testpass")
        self.client.force_authenticate(user=self.user)
    
        # Ensure only one savings record per user
        self.savings, _ = Savings.objects.get_or_create(user=self.user, defaults={"total_savings": Decimal("100.00")})

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
