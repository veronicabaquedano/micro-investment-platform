from django.db import models
from django.contrib.auth import get_user_model  # refer to user model

class Investment(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="portfolio")
    portfolio_name = models.CharField(max_length=100)  # Predefined portfolio
    allocated_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.portfolio_name}: ${self.allocated_amount}"