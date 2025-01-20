from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    # Fields to display in the admin interface
    list_display = ["email", "is_admin", "is_active"]
    list_filter = ["is_admin", "is_active"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        (
            "Permissions",
            {
                "fields": [
                    "is_admin",
                ]
            },
        ),
        (
            "Status",
            {
                "fields": [
                    "is_active",
                ]
            },
        ),
    ]
    # Fields to use when adding a new user
    add_fieldsets = [
        (
            None,
            {
                "classes": [
                    "wide",
                ],
                "fields": ["email", "password1", "password2"],
            },
        ),
    ]
    search_fields = [
        "email",
    ]
    ordering = [
        "email",
    ]
    filter_horizontal = []


# Register the custom user model with the custom admin class
admin.site.register(User, UserAdmin)

# Unregister the Group model if you're not using it
admin.site.unregister(Group)
