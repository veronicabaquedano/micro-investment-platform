from rest_framework import generics, permissions
from .models import Investment
from .serializers import InvestmentSerializer

class InvestmentListCreateView(generics.ListCreateAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated] # User must be logged in

    def get_queryset(self):
        # Only return the logged-in user's investments    #get
        return Investment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Ensure the investment is linked to the authenticated user    #post
        #Allows users to allocate funds from savings to a portfolio.
        serializer.save(user=self.request.user)
