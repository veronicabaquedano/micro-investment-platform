from django.urls import path
from .views import BankAccountView

urlpatterns = [
    path("", BankAccountView.as_view(), name="bank-account-list-create"),  # GET & POST
    #account_id parameter used to identify specific bank account to delete.
    path("<int:account_id>/", BankAccountView.as_view(), name="bank-account-delete"),  # DELETE
]
