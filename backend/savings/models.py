from django.db import models
from django.conf import settings
from decimal import Decimal


class Savings(models.Model):
    # Saving ID is automatically created as "id" by Django.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="savings"
    )  # User ID links to the user model. It references the id field in the User model.
    total_savings = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )  # Total amount
    last_updated = models.DateTimeField(auto_now=True)  # Last updated timestamp

    def __str__(self):
        return f"Savings for {self.user.email} - ${self.total_savings}"
    