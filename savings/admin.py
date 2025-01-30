from django.contrib import admin
from .models import Savings

@admin.register(Savings)
class SavingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_savings', 'last_updated')
