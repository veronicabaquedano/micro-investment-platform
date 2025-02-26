from rest_framework import serializers
from .models import Investment
from collections import defaultdict


class InvestmentSerializer(serializers.ModelSerializer):
    growth = serializers.SerializerMethodField()  #computed field that provides data for investment growth chart.

    class Meta:
        model = Investment
        fields = ["id", "portfolio_name", "allocated_amount", "created_at", "growth"]
        read_only_fields = ["id", "created_at"]
    #compute the growth data for the investment
    def get_growth(self, obj):
        # Get all investments for this user & portfolio
        investments = Investment.objects.filter(user=obj.user, portfolio_name=obj.portfolio_name).order_by("created_at")
        # Sum up the total amount invested for each day
        growth_data = defaultdict(float)
        for investment in investments:
            date_label = investment.created_at.strftime("%b %d")  # Format as "Jan 01"
            growth_data[date_label] += float(investment.allocated_amount)

        # Return structured growth data
        return {
            "labels": list(growth_data.keys()),
            "growth": list(growth_data.values()),
        }