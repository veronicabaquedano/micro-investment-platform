from django.db import models
from django.conf import settings  # refer to user model even if it changes


# represents structure of transaction table in db
class Transactions(models.Model):
    # establish connection between transaction and user tables.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions"
    )
    #store monetary value of transaction
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    #when transaction is created
    timestamp = models.DateTimeField(auto_now_add=True)
    #metadata for model
    class Meta:
        #order by timestamp descending
        ordering = ["-timestamp"]
