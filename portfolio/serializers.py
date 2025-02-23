from rest_framework import serializers
from .models import Investment


class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = ["id", "portfolio_name", "allocated_amount", "created_at"]
        read_only_fields = ["id", "created_at"]
