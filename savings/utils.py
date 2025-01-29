from decimal import Decimal, ROUND_UP

def calculate_round_up(amount):
    amount = Decimal(amount)
    #rounded_up = amount.quantize(Decimal('1.00'), rounding=ROUND_UP)
    rounded_up = amount.to_integral_value(rounding=ROUND_UP)
    round_up = rounded_up - amount
    print(f"Amount: {amount}, Rounded up: {rounded_up}, Round-up: {round_up}")  # Debugging
    return round_up
