import random
from decimal import Decimal, ROUND_UP
from datetime import timedelta
from django.utils import timezone
from users.models import User
from transactions.models import Transaction
from savings.models import Savings
from portfolio.models import Investment
from bank.models import BankAccount
from cryptography.fernet import Fernet
import os

# Get encryption key for bank model
BANK_ENCRYPTION_KEY = os.getenv("BANK_ENCRYPTION_KEY")
cipher = Fernet(BANK_ENCRYPTION_KEY.encode())

# Helper: Generate rounded-up savings amount
def get_round_up(amount):
    rounded = amount.quantize(Decimal("1.00"), rounding=ROUND_UP)
    return (rounded - amount).quantize(Decimal("0.01"))

# Test users
emails = ["user1@example.com", "user2@example.com", "user3@example.com", "user4@example.com"]
password = "TestPassword123"
users = []

for email in emails:
    user, created = User.objects.get_or_create(email=email)
    if created:
        user.set_password(password)
        user.save()
    users.append(user)

print(f"Created {len(users)} test users.")

# Add bank accounts
for user in users:
    BankAccount.objects.update_or_create(
        user=user,
        bank_name="Mock Bank",
        defaults={
            "encrypted_account_number": cipher.encrypt(b"123456789012"),
            "encrypted_routing_number": cipher.encrypt(b"987654321")
        }
    )
print("Created encrypted bank accounts.")

# Add savings accounts
for user in users:
    total_savings = Decimal("0.00")
    savings, _ = Savings.objects.update_or_create(user=user, defaults={"total_savings": total_savings})

# Create test transactions and add round-up savings
for user in users:
    savings = user.savings
    for _ in range(10):
        days_ago = random.randint(1, 30)
        date = timezone.now() - timedelta(days=days_ago)
        amount = Decimal(random.uniform(2, 100)).quantize(Decimal("0.01"))
        transaction = Transaction.objects.create(user=user, amount=amount, timestamp=date)
        # Simulate round-up
        round_up = get_round_up(amount)
        savings.total_savings += round_up
    savings.save()

print("Added 10 transactions per user with round-up savings.")

# Portfolio names and allocation amounts
portfolio_options = ["Conservative", "Growth", "Tech Focused", "Balanced"]

for user in users:
    for name in random.sample(portfolio_options, 2):  # Pick 2 random ones
        amount = Decimal(random.uniform(25, 200)).quantize(Decimal("0.01"))
        Investment.objects.update_or_create(
            user=user,
            portfolio_name=name,
            defaults={"allocated_amount": amount}
        )

print("Portfolio allocations complete.")
