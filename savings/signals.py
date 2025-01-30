from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from transactions.models import Transaction
from .models import Savings
from .utils import calculate_round_up


# Create a Savings entry when a new user is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_savings(sender, instance, created, **kwargs):
    if created:
        Savings.objects.create(user=instance)


# Update Savings when a *new* Transaction is created
@receiver(post_save, sender=Transaction)
def update_savings(sender, instance, created, **kwargs):
    if created:
        # Use the utility function to calculate the round-up amount
        round_up = calculate_round_up(instance.amount)
        # Update the savings entry for the user
        savings = Savings.objects.get(user=instance.user)   
        savings.total_savings += round_up
        savings.save()