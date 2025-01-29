from rest_framework import serializers
from .models import Savings

class SavingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Savings
        fields = ['id', 'total_savings', 'last_updated']
        read_only_fields = ['id', 'last_updated']
