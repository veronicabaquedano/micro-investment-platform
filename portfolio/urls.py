from django.urls import path
from .views import InvestmentListCreateView

urlpatterns = [
    path('', InvestmentListCreateView.as_view(), name='portfolio-list-create'),
]
