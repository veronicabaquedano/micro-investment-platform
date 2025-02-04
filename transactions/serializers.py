from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "amount", "timestamp"]  # Include all fields
        read_only_fields = ["id", "timestamp"]  # `id` and `timestamp` are auto-generated

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Transaction amount must be positive.")
        return value
