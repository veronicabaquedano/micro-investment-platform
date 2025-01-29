from django.urls import path
from .views import SavingsDetailView

urlpatterns = [
    path('', SavingsDetailView.as_view(), name='savings-detail'),  # Endpoint for retrieving savings details
]
