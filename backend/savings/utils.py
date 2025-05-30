from decimal import Decimal, ROUND_CEILING

def calculate_round_up(amount):
    # Ensure the amount is a Decimal
    amount = Decimal(str(amount))
    # Round up to the next whole number
    rounded_up = amount.to_integral_value(rounding=ROUND_CEILING)
    # Calculate the round-up amount
    round_up = (rounded_up - amount).quantize(Decimal("0.01"))
    return round_up

