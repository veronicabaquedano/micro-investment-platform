import random
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from users.models import User
from transactions.models import Transaction
from savings.models import Savings
from portfolio.models import Investment
from bank.models import BankAccount
from savings.utils import calculate_round_up
from cryptography.fernet import Fernet
import os

# 🔌 Disconnect savings signal during test data creation
from django.db.models.signals import post_save
from savings.signals import update_savings
post_save.disconnect(update_savings, sender=Transaction)

# 🔁 Clear old data (except superuser)
Transaction.objects.all().delete()
Investment.objects.all().delete()
Savings.objects.all().delete()
BankAccount.objects.all().delete()
User.objects.exclude(is_admin=True).delete()

# 🔐 Set up encryption for fake bank data
BANK_ENCRYPTION_KEY = os.getenv("BANK_ENCRYPTION_KEY")
cipher = Fernet(BANK_ENCRYPTION_KEY.encode())

# 👥 Create test users
emails = ["user1@example.com", "user2@example.com", "user3@example.com", "user4@example.com"]
password = "TestPassword123"
users = []

for email in emails:
    user, created = User.objects.get_or_create(email=email)
    if created:
        user.set_password(password)
        user.save()
    users.append(user)

print(f"✅ Created {len(users)} test users.")

# 🏦 Add encrypted bank accounts
for user in users:
    account_number = f"{random.randint(100000000000, 999999999999)}"
    routing_number = f"{random.randint(100000000, 999999999)}"
    encrypted_account_number = cipher.encrypt(account_number.encode())
    encrypted_routing_number = cipher.encrypt(routing_number.encode())

    BankAccount.objects.update_or_create(
        user=user,
        bank_name="Mock Bank",
        defaults={
            "encrypted_account_number": encrypted_account_number,
            "encrypted_routing_number": encrypted_routing_number
        }
    )
print("✅ Created encrypted bank accounts.")

# 💰 Create savings + transactions with round-up logic
for user in users:
    savings, _ = Savings.objects.get_or_create(user=user)

    for _ in range(10):
        days_ago = random.randint(1, 30)
        date = timezone.now() - timedelta(days=days_ago)
        amount = Decimal(str(random.uniform(2, 100))).quantize(Decimal("0.01"))

        Transaction.objects.create(user=user, amount=amount, timestamp=date)

        round_up = calculate_round_up(amount)
        print(f"Amount: {amount}, Round-up: {round_up}")

        savings.total_savings += round_up

    savings.save()

print("✅ Added 10 transactions per user with round-up savings.")

# 📊 Create portfolio investments
portfolio_options = ["Conservative", "Growth", "Tech Focused", "Balanced"]

for user in users:
    for name in random.sample(portfolio_options, 2):  # Pick 2 random ones
        amount = Decimal(random.uniform(25, 200)).quantize(Decimal("0.01"))
        Investment.objects.update_or_create(
            user=user,
            portfolio_name=name,
            defaults={"allocated_amount": amount}
        )

print("✅ Portfolio allocations complete.")

# 🔌 Reconnect the savings signal
post_save.connect(update_savings, sender=Transaction)
