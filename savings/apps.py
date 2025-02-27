from django.apps import AppConfig

class SavingsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "savings"

    def ready(self):
        import savings.signals # Import the signals to connect them when the app is ready
