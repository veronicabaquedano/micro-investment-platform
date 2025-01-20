from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    # creates and saves regular users.
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(
            email=self.normalize_email(email),
        )  # new user instance
        user.set_password(password)  # hash and set password
        user.save(using=self._db)  # save user to db
        return user

    # creates and saves admin users
    def create_superuser(self, email, password=None):
        user = self.create_user(
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser):
    email = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    # set_password(raw_password)
    # check_password(raw_password)
    USERNAME_FIELD = "email"
