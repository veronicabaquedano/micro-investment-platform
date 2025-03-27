from django.contrib import admin
from .models import BankAccount


class BankAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "bank_name", "last_four_digits", "created_at")

    def last_four_digits(self, obj):
        return "****" + obj.get_decrypted_account_number()[-4:]


admin.site.register(BankAccount, BankAccountAdmin)
