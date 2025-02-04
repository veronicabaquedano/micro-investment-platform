from django.db import models
from django.conf import settings # refer to user model

class Investment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="portfolio")
    portfolio_name = models.CharField(max_length=100)  # Predefined portfolio
    allocated_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ("user", "portfolio_name")  # Ensure unique portfolio names per user
    
    def __str__(self):
        return f"{self.user.email} - {self.portfolio_name}: ${self.allocated_amount}"