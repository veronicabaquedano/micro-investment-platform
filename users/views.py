from rest_framework.views import APIView #class-based view provided by Django Rest Framework (DRF) for building APIs.
from rest_framework.response import Response #Used to return structured responses (e.g., JSON).
from rest_framework import status #Provides HTTP status codes for responses (e.g., 201 Created, 400 Bad Request).
from users.serializers import UserSerializer


#handles user registration. can handle POST and GET because of APIView
class UserRegistrationView(APIView):
    #send data to the server /sensitive info
    def post(self, request):
        #contains the data sent in the API request
        # data is passed to the UserSerializer for validation
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(    {"message": "User created successfully."}, 
    status=status.HTTP_201_CREATED)
        
        
   

