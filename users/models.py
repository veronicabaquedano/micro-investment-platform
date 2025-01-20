from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    # creates and saves regular users.
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        # new user instance
        user = self.model(
            email=self.normalize_email(email),
        )  
        user.set_password(password)  # hash and set password
        user.save(using=self._db)  # save user to db
        return user

    # creates and saves admin users
    def create_superuser(self, email, password=None):
        # Call create_user
        user = self.create_user(
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
        # Unique identifier for users
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True) # Indicates if the user is active
    is_admin = models.BooleanField(default=False) #indicates if user is admin
    objects = UserManager()  # Assign UserManager to the User model
    USERNAME_FIELD = "email"   # Use email as the unique identifier

