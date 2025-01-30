from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import Savings
from .serializers import SavingsSerializer

class SavingsDetailView(generics.RetrieveAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            # Retrieve the Savings object associated with the user
            return Savings.objects.get(user=self.request.user)
        except Savings.DoesNotExist:
            raise NotFound("Savings not found for this user.")  # Raise 404 error if not found
