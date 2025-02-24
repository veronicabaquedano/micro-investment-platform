from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import Savings
from .serializers import SavingsSerializer
import logging

logger = logging.getLogger(__name__)


class SavingsDetailView(generics.RetrieveAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        logger.info(f"🔍 DEBUG: request.user = {user}")  # ✅ Print user info to Django logs
        try:
            # Retrieve the Savings object associated with the user
            return Savings.objects.get(user=self.request.user)
        except Savings.DoesNotExist:
            raise NotFound(
                "Savings not found for this user."
            )  # Raise 404 error if not found
