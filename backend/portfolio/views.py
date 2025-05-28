from rest_framework import generics, permissions, serializers
from .models import Investment
from .serializers import InvestmentSerializer
from savings.models import Savings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime, timedelta
import random


class InvestmentListCreateView(generics.ListCreateAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]  # User must be logged in

    def get_queryset(self):
        # Only return the logged-in user's investments    #get
        return Investment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        # extract the data from the request from the serializer
        allocated_amount = serializer.validated_data["allocated_amount"]
        portfolio_name = serializer.validated_data["portfolio_name"]
        # Get user's savings
        savings = Savings.objects.get(user=user)

        # Check if user has enough savings
        if allocated_amount > savings.total_savings:
            raise serializers.ValidationError({"error": "Not enough savings available"})

        # Check if portfolio name already exists for this user → instead of blocking, update it
        existing_investment = Investment.objects.filter(
            user=user, portfolio_name=portfolio_name
        ).first()
        if existing_investment:
            existing_investment.allocated_amount += (
                allocated_amount  # Add new investment amount
            )
            existing_investment.save()
        else:
            serializer.save(user=user)  # Create new investment

        # Deduct allocated amount from savings
        savings.total_savings -= allocated_amount
        savings.save()


# class to fetch investment growth over time
class InvestmentGrowthView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Require JWT authentication

    def get(self, request):
        # retrieve logged in user and get all their investments
        user = request.user
        investments = Investment.objects.filter(user=user).order_by("created_at")

        if not investments.exists():
            return Response({"labels": [], "growth": [], "invested": []})

        # Define a fixed start date (simulate history)
        start_date = datetime.now() - timedelta(days=180)  # Go back 6 months
        labels = []
        growth = []
        invested = []
        total_growth = 0
        total_invested = 0
        investment_map = {}

        # Store Actual Investments in a Dictionary
        for investment in investments:
            date_label = investment.created_at.strftime("%Y-%m-%d")
            investment_map[date_label] = investment_map.get(date_label, 0) + float(
                investment.allocated_amount
            )

        # Generate & Process Investment Data
        current_mock_investment = 100.0  # Start with a base investment
        current_date = start_date

        while current_date <= datetime.now() + timedelta(
            days=7
        ):  # Extend 1 week into the future
            date_label = current_date.strftime("%Y-%m-%d")  # Example: "2025-02-05"
            labels.append(date_label)

            # Add real investments or mock investments if none exist
            investment_today = investment_map.get(
                date_label, round(current_mock_investment, 2)
            )

            # Ensure today's investment is included if missing
            if (
                date_label == datetime.now().strftime("%Y-%m-%d")
                and date_label not in investment_map
            ):
                latest_investment = investments.last()
                if latest_investment:
                    investment_today = round(
                        float(latest_investment.allocated_amount), 2
                    )
                    investment_map[date_label] = (
                        investment_today  # Store today's investment
                    )

            investment_variation = random.uniform(
                -2, 5
            )  # Small fluctuations in cash flow
            total_invested += round(investment_today + investment_variation, 2)

            # Increase mock investment slightly for the next cycle
            current_mock_investment += random.uniform(5, 20)

            # Ensure growth starts from the first investment (remove early zeros)
            if total_invested > 0 and total_growth == 0:
                total_growth = (
                    total_invested  # Set growth to match invested amount initially
                )

            # Ensure investments increase over time
            if total_invested > 0:
                # Simulate stock market fluctuations
                random_factor = random.uniform(
                    -0.05, 0.1
                )  # Market fluctuates -5% to +10% per week
                total_growth *= 1 + random_factor
                total_growth = max(
                    total_growth, total_invested * 0.85
                )  # Prevent unrealistic crashes
            else:
                total_growth = total_invested

            invested.append(round(total_invested, 2))
            growth.append(round(total_growth, 2))
            current_date += timedelta(days=7)  # Move forward by one week

        return Response({"labels": labels, "growth": growth, "invested": invested})
