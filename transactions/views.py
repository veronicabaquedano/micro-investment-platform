from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer
import random
from .models import TRANSACTION_DESCRIPTIONS



class TransactionView(APIView):
    permission_classes = [IsAuthenticated]  # User must be logged in

    def get(self, request):
        """List all transactions for the logged-in user."""
        transactions = Transaction.objects.filter(user=request.user)
        # uses serializer to convert data into JSON
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new transaction for the logged-in user."""
        data = request.data.copy()

        # Assign a random description if none is provided
        if "description" not in data or not data["description"].strip():
            data["description"] = random.choice(TRANSACTION_DESCRIPTIONS)

        # validate and process data provided by user
        serializer = TransactionSerializer(data=request.data , context={"request": request})
        if serializer.is_valid():
            serializer.save(user=request.user)  # Attach the logged-in user, saves in db
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
