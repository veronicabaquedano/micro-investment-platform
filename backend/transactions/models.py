from django.db import models
from django.conf import settings  # refer to user model even if it changes
import random

# List of sample transaction descriptions
TRANSACTION_DESCRIPTIONS = [
    "Coffee shop purchase",
    "Grocery store",
    "Online subscription",
    "ATM withdrawal",
    "Dining out",
    "Gas station",
    "Retail purchase",
    "Utility bill payment",
    "Gym membership",
    "Streaming service payment",
]


# represents structure of transaction table in db
class Transaction(models.Model):
    # establish connection between transaction and user tables. one-to-many
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions"
    )
    # store monetary value of transaction
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    # when transaction is created
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

    # metadata for model
    class Meta:
        # order by timestamp descending
        ordering = ["-timestamp"]

    def save(self, *args, **kwargs):
        """Assign a random description if none is provided."""
        if not self.description:
            self.description = random.choice(TRANSACTION_DESCRIPTIONS)
        super().save(*args, **kwargs)

    # how model is represented as a string
    def __str__(self):
        return f"Transaction {self.id} - {self.user.email} -${self.amount} - {self.description}"
