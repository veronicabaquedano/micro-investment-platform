from django.db import models
from django.contrib.auth.models import AbstractBaseUser


class MyUser(AbstractBaseUser):
    email = models.CharField(max_length=150, unique=True)
    ...
    USERNAME_FIELD = "email"
