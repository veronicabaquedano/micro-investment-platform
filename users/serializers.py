from rest_framework import serializers
from users.models import User


# validates incoming data and interacts with model/ maps model fields to serializer fields
# (e.g., email is required, password is not blank).
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        # fields to include in the serialized data
        fields = ["email", "password"]
        # write-only, so won’t be returned in API responses
        extra_kwargs = {"password": {"write_only": True}}


# handles creation of new user
# validated_data, contains the validated email and password from the API request.
def create(self, validated_data):
    user = User(email=validated_data["email"])
    user.set_password(validated_data["password"])  # Hash password
    user.save()  # Save user
    return user
