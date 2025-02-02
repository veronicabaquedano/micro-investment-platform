from decimal import Decimal, ROUND_UP


def calculate_round_up(amount):
    amount = Decimal(amount)
    # rounded_up = amount.quantize(Decimal('1.00'), rounding=ROUND_UP)
    rounded_up = amount.to_integral_value(rounding=ROUND_UP)
    round_up = rounded_up - amount
    return round_up
