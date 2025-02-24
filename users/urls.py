from django.urls import path
from users.views import RegisterView, LoginView, get_csrf_token

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Registration endpoint
    path('login/', LoginView.as_view(), name='login'),          # Login endpoint
    path('csrf/', get_csrf_token, name='csrf_token'),  # CSRF endpoint
]
