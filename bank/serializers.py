from rest_framework import serializers
from .models import BankAccount


class BankAccountSerializer(serializers.ModelSerializer):
    # Accept account_number and routing_number when creating a bank account
    account_number = serializers.CharField(write_only=True)  # Input only
    routing_number = serializers.CharField(write_only=True)  # Input only

    # Retrieve decrypted values when listing accounts
    decrypted_account_number = serializers.SerializerMethodField()
    decrypted_routing_number = serializers.SerializerMethodField()

    class Meta:
        model = BankAccount
        fields = [
            "id",
            "bank_name",
            "account_number",
            "routing_number",
            "decrypted_account_number",
            "decrypted_routing_number",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "decrypted_account_number",
            "decrypted_routing_number",
        ]

    def get_decrypted_account_number(self, obj):
        """Return decrypted account number"""
        return obj.get_decrypted_account_number()

    def get_decrypted_routing_number(self, obj):
        """Return decrypted routing number"""
        return obj.get_decrypted_routing_number()

    def create(self, validated_data):
        """Encrypt account and routing numbers before saving"""
        return BankAccount.objects.create(
            user=self.context["request"].user,
            encrypted_account_number=validated_data[
                "account_number"
            ],  # Will be encrypted in save()
            encrypted_routing_number=validated_data["routing_number"],
            bank_name=validated_data["bank_name"],
        )

    def validate_account_number(self, value):
        """Ensure account number is numeric and 6-17 digits long"""
        if not value.isdigit():
            raise serializers.ValidationError(
                "Account number must contain only digits."
            )
        if not 6 <= len(value) <= 17:
            raise serializers.ValidationError(
                "Account number must be between 6 and 17 digits."
            )
        return value

    def validate_routing_number(self, value):
        """Ensure routing number is exactly 9 digits"""
        if not value.isdigit():
            raise serializers.ValidationError(
                "Routing number must contain only digits."
            )
        if len(value) != 9:
            raise serializers.ValidationError(
                "Routing number must be exactly 9 digits."
            )
        return value
