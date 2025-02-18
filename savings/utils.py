from decimal import Decimal, ROUND_UP


def calculate_round_up(amount):
    # amount (e.g. 1.23) is converted to a Decimal object.
    amount = Decimal(amount)
    #rounding towards positive infinity. (ROUND_UP) e.g. 1.23 -> 2.00
    rounded_up = amount.to_integral_value(rounding=ROUND_UP)
    # e.g. 2.00 - 1.23 = 0.77
    round_up = rounded_up - amount
    return round_up
