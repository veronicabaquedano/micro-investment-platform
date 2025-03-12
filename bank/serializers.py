from rest_framework import serializers
from .models import BankAccount

class BankAccountSerializer(serializers.ModelSerializer):
    # computed fields that provide decrypted account and routing numbers
    account_number = serializers.SerializerMethodField()
    routing_number = serializers.SerializerMethodField()

    class Meta:
        model = BankAccount
        fields = ["id", "bank_name", "account_number", "routing_number", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_account_number(self, obj):
        """Return decrypted account number"""
        return obj.get_decrypted_account_number()

    def get_routing_number(self, obj):
        """Return decrypted routing number"""
        return obj.get_decrypted_routing_number()

    #extracts validated data from serializer and creates a new BankAccount instance
    def create(self, validated_data):
        """Encrypt data before saving"""
        bank_account = BankAccount(
            user=self.context["request"].user,
            bank_name=validated_data["bank_name"],
            encrypted_account_number=validated_data["account_number"],  # Will be encrypted in `save()`
            encrypted_routing_number=validated_data["routing_number"],  # Will be encrypted in `save()`
        )
        bank_account.save()
        return bank_account
