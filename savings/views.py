from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  
from .models import Savings
from .serializers import SavingsSerializer
from rest_framework.exceptions import NotFound

class SavingsDetailView(generics.RetrieveAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        #retrieves the Savings object directly tied to the authenticated user.
        print(f"Request user: {self.request.user}")  # Debugging line
        print(f"User is authenticated: {self.request.user.is_authenticated}")  # Debug
        try:
            savings = Savings.objects.get(user=self.request.user)
            print(f"Retrieved savings for user {self.request.user.email}: {savings.total_savings}")  # Debug
            return savings
        except Savings.DoesNotExist:
            raise NotFound("Savings not found for this user.")
