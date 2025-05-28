from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet
import base64
import os

SECRET_KEY = os.getenv(
    "BANK_ENCRYPTION_KEY"
)  # Key used to encrypt/decrypt account and routing numbers
cipher_suite = Fernet(SECRET_KEY.encode())


class BankAccount(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bank_accounts"
    )  # Links the account to a user
    bank_name = models.CharField(max_length=255)
    encrypted_account_number = models.BinaryField()
    encrypted_routing_number = models.BinaryField()
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # Timestamp for when the account was linked

    def save(self, *args, **kwargs):
        """Encrypts account and routing numbers before saving"""
        if isinstance(self.encrypted_account_number, str):
            self.encrypted_account_number = cipher_suite.encrypt(
                self.encrypted_account_number.encode()
            )
        if isinstance(self.encrypted_routing_number, str):
            self.encrypted_routing_number = cipher_suite.encrypt(
                self.encrypted_routing_number.encode()
            )
        super().save(*args, **kwargs)

    def get_decrypted_account_number(self):
        """Decrypts the account number when retrieving"""
        return cipher_suite.decrypt(self.encrypted_account_number).decode()

    def get_decrypted_routing_number(self):
        """Decrypts the routing number when retrieving"""
        return cipher_suite.decrypt(self.encrypted_routing_number).decode()

    def __str__(self):
        return f"{self.bank_name} - ****{self.get_decrypted_account_number()[-4:]}"  # Mask first 4 account numbers
