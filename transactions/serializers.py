from rest_framework import serializers
from .models import Transaction
from savings.models import Savings


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "amount", "timestamp", "description"]  # Include all fields
        read_only_fields = ["id", "timestamp"]  # `id` and `timestamp` are auto-generated

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Transaction amount must be positive.")
        return value
    
    def validate(self, data):
        """Ensure the transaction does not reduce savings below zero."""
        request = self.context.get("request")  # Get request safely
        user = request.user if request else None  # Ensure user is retrieved

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("User is required for transactions.")

        savings = Savings.objects.filter(user=user).first()
        if not savings:
            raise serializers.ValidationError("User has no savings account.")

        if data["amount"] > savings.total_savings:
            raise serializers.ValidationError("Insufficient savings for this transaction.")

        return data