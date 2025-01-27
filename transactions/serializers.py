from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "amount", "timestamp"]  # Include all fields
        read_only_fields = ["id", "timestamp"]  # `id` and `timestamp` are auto-generated


