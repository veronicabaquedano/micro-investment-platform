from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# creates users
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
        user.is_staff = True  # Allow access to admin
        user.save(using=self._db)
        return user


# save user to database/ represents user structure in db
class User(AbstractBaseUser):
    # Unique identifier for users
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)  # Indicates if the user is active
    is_admin = models.BooleanField(default=False)  # indicates if user is admin
    is_staff = models.BooleanField(default=False)  # Admin access

    # Add more fields like first_name, last_name if needed
    objects = UserManager()  # Assign UserManager to the User model
    USERNAME_FIELD = "email"  # Use email as the unique identifier
    REQUIRED_FIELDS = []

    # returns email for readability
    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        if self.is_admin: 
            return True
        return False

    def has_module_perms(self, app_label):
        if self.is_admin: 
            return True
        return False

    @property
    def is_superuser(self):
        return self.is_admin

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email
