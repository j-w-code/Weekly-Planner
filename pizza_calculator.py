# Pizza Order Cost Calculator
# A simple tool to calculate the total cost of a pizza order

print("Welcome to Pizza Palace!")
print("Let's calculate your order cost.")

# Define pizza prices and costs
small_pizza_cost = 8.00
medium_pizza_cost = 10.00
large_pizza_cost = 12.00
extra_topping_cost = 1.00
delivery_fee_first_five = 2.00
delivery_fee_additional = 1.00

# Get user input for pizza size
pizza_size = input("Enter pizza size (small, medium, large): ").lower()

# Validate pizza size and set cost
if pizza_size == "small":
    pizza_cost = small_pizza_cost
elif pizza_size == "medium":
    pizza_cost = medium_pizza_cost
elif pizza_size == "large":
    pizza_cost = large_pizza_cost
else:
    print("Invalid pizza size. Please choose small, medium, or large.")
    exit()

# Get number of toppings
pizza_toppings = int(input("Enter number of extra toppings: "))
if pizza_toppings < 0:
    print("Number of toppings cannot be negative.")
    exit()

# Get delivery distance
delivery_distance = float(input("Enter delivery distance in miles: "))
if delivery_distance < 0:
    print("Delivery distance cannot be negative.")
    exit()

# Calculate delivery fee
delivery_fee = delivery_fee_first_five + max(0, delivery_distance - 5) * delivery_fee_additional

# Calculate total cost
total_pizza_cost = pizza_cost + (extra_topping_cost * pizza_toppings) + delivery_fee

# Display breakdown and total
print(f"\nOrder Summary:")
print(f"Base pizza cost: ${pizza_cost:.2f}")
print(f"Extra toppings cost: ${extra_topping_cost * pizza_toppings:.2f}")
print(f"Delivery fee: ${delivery_fee:.2f}")
print(f"Total order cost: ${total_pizza_cost:.2f}")
