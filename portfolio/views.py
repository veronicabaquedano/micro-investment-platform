from rest_framework import generics, permissions, serializers
from .models import Investment
from .serializers import InvestmentSerializer
from savings.models import Savings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

class InvestmentListCreateView(generics.ListCreateAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated] # User must be logged in

    def get_queryset(self):
        # Only return the logged-in user's investments    #get
        return Investment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        #extract the data from the request from the serializer
        allocated_amount = serializer.validated_data["allocated_amount"]
        portfolio_name = serializer.validated_data["portfolio_name"]
        # Get user's savings
        savings = Savings.objects.get(user=user)
        
        # Check if user has enough savings
        if allocated_amount > savings.total_savings:
            raise serializers.ValidationError({"error": "Not enough savings available"})

        # Check if portfolio name already exists for this user
        if Investment.objects.filter(user=user, portfolio_name=portfolio_name).exists():
            raise serializers.ValidationError({"error": "Portfolio with this name already exists"})

        # Deduct allocated amount from savings
        savings.total_savings -= allocated_amount
        savings.save()

        # Create the investment
        serializer.save(user=user)

#class to fetch investment growth over time
class InvestmentGrowthView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]  #Require JWT authentication

    def get(self, request):
        user = request.user
        investments = Investment.objects.filter(user=user).order_by("created_at")

        if not investments.exists():
            return Response({"labels": [], "growth": []})

        labels = []
        growth = []
        total_growth = 0

        for investment in investments:
            date_label = investment.created_at.strftime("%b %d")  # Example: "Feb 25"
            labels.append(date_label)
            total_growth += float(investment.allocated_amount)  # Convert Decimal to float
            growth.append(total_growth)

        return Response({"labels": labels, "growth": growth})