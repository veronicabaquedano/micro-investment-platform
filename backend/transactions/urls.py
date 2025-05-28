from django.urls import path
from transactions.views import TransactionView

urlpatterns = [
    path(
        "", TransactionView.as_view(), name="transaction-list-create"
    ),  # No "transactions/" here, as it's already included in the main urls.py
]
