from rest_framework import serializers
from users.models import User


# validates incoming data and interacts with model/ maps model fields to serializer fields
# (e.g., email is required, password is not blank).
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            "min_length": "This password is too short. It must contain at least 8 characters."
        },
    )

    class Meta:
        model = User
        # fields to include in the serialized data
        fields = ["email", "password"]
        # write-only, so won’t be returned in API responses
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        """
        Check that the email is in a valid format and not already in use.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    # handles creation of new user
    # validated_data, contains the validated email and password from the API request.
    def create(self, validated_data):
        user = User(email=validated_data["email"])
        user.set_password(validated_data["password"])  # Hash password
        user.save()  # Save user
        return user
