def calculate_total_cost(subtotal, state):
    tax_rates = {
        'CA': 0.08,
        'NY': 0.07,
        'TX': 0.0625
    }

    shipping_charges = 10.00

    if state in tax_rates:
        sales_tax = subtotal * tax_rates[state]
    else:
        sales_tax = 0.00

    total_cost = subtotal + sales_tax + shipping_charges
    return total_cost

# Example usage
subtotal = 100.00
state = 'CA'

shipping_charges = 10.00

total_cost = calculate_total_cost(subtotal, state)
print(f"Subtotal: ${subtotal:.2f}")
print(f"Shipping Charges: ${shipping_charges:.2f}")
print(f"Total Cost: ${total_cost:.2f}")