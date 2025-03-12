from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import BankAccount
from .serializers import BankAccountSerializer

class BankAccountView(APIView):
    permission_classes = [IsAuthenticated]  # User must be logged in

    def get(self, request):
        """Retrieve all bank accounts linked to the authenticated user."""
        bank_accounts = BankAccount.objects.filter(user=request.user)  # Get user's accounts
        serializer = BankAccountSerializer(bank_accounts, many=True)  # Serialize data #can handle multiple objects
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Add a new bank account for the authenticated user, ensuring no duplicates and limiting to 5 accounts."""
        # Check if the user has reached the limit of linked accounts (5 max)
        if BankAccount.objects.filter(user=request.user).count() >= 5:
            return Response({"error": "You can only link up to 5 bank accounts."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BankAccountSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            # Check for duplicates before saving
            existing_accounts = BankAccount.objects.filter(
                user=request.user,
                bank_name=serializer.validated_data["bank_name"],
                encrypted_account_number=serializer.validated_data["account_number"],  # Encrypted in save()
            )
            if existing_accounts.exists():
                return Response({"error": "This bank account is already linked."}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save(user=request.user)  # Save the new account
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        """Delete a specific bank account by ID if it belongs to the authenticated user."""
        account_id = request.data.get("id")  # Get account ID from request
        if not account_id:
            return Response({"error": "Bank account ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            bank_account = BankAccount.objects.get(id=account_id, user=request.user)  # Ensure it belongs to the user
            bank_account.delete()
            return Response({"message": "Bank account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except BankAccount.DoesNotExist:
            return Response({"error": "Bank account not found."}, status=status.HTTP_404_NOT_FOUND)
