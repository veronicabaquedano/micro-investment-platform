from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  
from .models import Savings
from .serializers import SavingsSerializer


class SavingsDetailView(generics.RetrieveAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the savings for the currently authenticated user
        return Savings.objects.filter(user=self.request.user)
