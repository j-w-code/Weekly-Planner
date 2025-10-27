# Pizza Order Cost Calculator
# A simple tool to calculate the total cost of a pizza order

# TODO: Get user input for pizza size, toppings, and delivery distance
# TODO: Calculate base pizza cost
# TODO: Calculate topping cost  
# TODO: Calculate delivery fee
# TODO: Calculate total and display result

pizza_sizes = input("Enter pizza size (small, medium, large): ").lower()
pizza_toppings = input("Enter number of extra toppings: (pepperoni, anchovies, mushrooms, extra cheese) ")
pizza_cost = small_pizza_cost = 8.00, medium_pizza_cost = 10.00, large_pizza_cost = 12.00
extra_topping_cost = 1.00
delivery_distance = float(input("Enter delivery distance in miles: "))
delivery_fee_first_five = 2.00
delivery_fee_additional = 1.00

total_pizza_cost = pizza_cost + (extra_topping_cost * pizza_toppings) + (delivery_fee_first_five + max(0, delivery_distance - 5) * delivery_fee_additional)


print("Welcome to Pizza Palace!")
print("Let's calculate your order cost.")
print(f"Base pizza cost: ${pizza_cost:.2f}")
print(f"Extra toppings cost: ${extra_topping_cost * pizza_toppings:.2f}")
print(f"Delivery fee: ${delivery_fee_first_five + max(0, delivery_distance - 5) * delivery_fee_additional:.2f}")
total_cost = total_pizza_cost
print(f"Total order cost: ${total_cost:.2f}")
    = int(input("Enter number of extra toppings: "))
if pizza_sizes == "small":
    pizza_cost = small_pizza_cost
elif pizza_sizes == "medium":
    pizza_cost = medium_pizza_cost
elif pizza_sizes == "large":
    pizza_cost = large_pizza_cost
else:
    print("Invalid pizza size. Please choose small, medium, or large.")
    exit()
pizza_toppings = int(input("Enter number of extra toppings: "))
if pizza_toppings < 0:
    print("Number of toppings cannot be negative.")
    exit()      
if delivery_distance < 0:
    print("Delivery distance cannot be negative.")
    exit()
total_pizza_cost = pizza_cost + (extra_topping_cost * pizza_toppings) + (delivery_fee_first_five + max(0, delivery_distance - 5) * delivery_fee_additional)
print(f"Your total pizza order cost is: ${total_pizza_cost:.2f}