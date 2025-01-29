from django.urls import path
from .views import SavingsDetailView

urlpatterns = [
    path('savings/', SavingsDetailView.as_view(), name='savings-detail'),  # Endpoint for retrieving savings details
]
