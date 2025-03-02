from django.urls import path
from .views import InvestmentListCreateView, InvestmentGrowthView

urlpatterns = [
    path("", InvestmentListCreateView.as_view(), name="portfolio-list-create"),
    path("growth/", InvestmentGrowthView.as_view(), name="investment-growth"),
]
