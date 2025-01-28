from decimal import Decimal

def calculate_round_up(amount):
    return Decimal(amount).quantize(Decimal('1.00')).ceil() - amount
