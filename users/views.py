from rest_framework.views import APIView # class-based view provided by Django Rest Framework (DRF) for building APIs.
from rest_framework.response import Response # Used to return structured responses (e.g., JSON).
from rest_framework import status # Provides HTTP status codes for responses (e.g., 201 Created, 400 Bad Request).
from django.contrib.auth import authenticate
from users.serializers import UserSerializer
from rest_framework.permissions import AllowAny


# handles user registration. can handle POST and GET because of APIView
class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allows anyone to register
    # send data to the server /sensitive info
    def post(self, request):
        # contains the data sent in the API request
        # data is passed to the UserSerializer for validation
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        #extract the user's email and password from the incoming HTTP request data. 
        email = request.data.get("email", "").strip().lower()  # Normalize email
        password = request.data.get("password", "")
        user = authenticate(request, email=email, password=password)  # checks the provided email and password against the database.

        if user is not None:
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)