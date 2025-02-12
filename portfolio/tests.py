from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Investment
from savings.models import Savings  # Ensure savings exist before allocation
from decimal import Decimal
from rest_framework import status

User = get_user_model()


class PortfolioTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com", password="testpass"
        )
        self.client.force_authenticate(user=self.user)

        # Ensure only one savings record per user
        self.savings, _ = Savings.objects.get_or_create(
            user=self.user, defaults={"total_savings": Decimal("100.00")}
        )
        self.savings.total_savings = Decimal("100.00")  # Ensure correct amount
        self.savings.save()  # Save to database
        self.savings.refresh_from_db()  # Ensures correct balance

    def test_create_investment(self):
        """Test allocating savings to a portfolio."""
        data = {"portfolio_name": "Tech Growth Fund", "allocated_amount": 50.00}
        response = self.client.post("/portfolio/", data)
        # Check if allocation was successful
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Investment.objects.count(), 1)
        investment = Investment.objects.first()
        self.assertEqual(investment.allocated_amount, 50.00)

    def test_get_investments(self):
        """Test retrieving the user's portfolio allocations."""
        # Create an investment first
        Investment.objects.create(
            user=self.user, portfolio_name="Tech Growth Fund", allocated_amount=50.00
        )

        response = self.client.get("/portfolio/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # Ensure one investment is returned
        self.assertEqual(response.data[0]["portfolio_name"], "Tech Growth Fund")

    def test_cannot_allocate_more_than_available_savings(self):
        data = {
            "portfolio_name": "High Risk Fund",
            "allocated_amount": 150.00,  # More than the $100 savings
        }
        response = self.client.post("/portfolio/", data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Not enough savings available")

    def test_cannot_create_duplicate_portfolio_names(self):
        # Create the first portfolio
        Investment.objects.create(
            user=self.user, portfolio_name="Tech Growth Fund", allocated_amount=50.00
        )

        # Try to create another with the same name
        data = {"portfolio_name": "Tech Growth Fund", "allocated_amount": 20.00}
        response = self.client.post("/portfolio/", data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(
            response.data["error"], "Portfolio with this name already exists"
        )

    def test_user_cannot_access_other_users_portfolio(self):
        """Ensure a user cannot access another user's portfolio investments."""
        user2 = User.objects.create_user(
            email="otheruser@example.com", password="testpass"
        )
        Investment.objects.create(
            user=user2, portfolio_name="Other User Fund", allocated_amount=30.00
        )

        response = self.client.get("/portfolio/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)  # Should return an empty list

    def test_unauthenticated_user_cannot_create_investment(self):
        """Ensure an unauthenticated user cannot create an investment."""
        self.client.logout()  # Ensure the user is logged out
        data = {"portfolio_name": "Unauthorized Fund", "allocated_amount": 50.00}

        response = self.client.post("/portfolio/", data)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
