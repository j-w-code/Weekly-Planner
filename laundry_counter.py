# Initialize counters - track progress and set goal
folded_shirts = 0
target_folded_shirts = 5

# Main loop - continue until target reached OR user exits
while folded_shirts < target_folded_shirts:
    # Get user decision and normalize input
    user_response = input("Would you like to fold a shirt?(yes/no):").strip().lower()

    # Process user choice
    if user_response == "yes":
        folded_shirts += 1  # Increment counter
        print(f"Shirt folded! Total folded shirts: {folded_shirts}")
    elif user_response == "no":
        print("Unfolded clothes often wear faster. Goodbye!")
        break  # Exit loop immediately
        
# Check completion status after loop ends
if folded_shirts == target_folded_shirts:
    print("All shirts are folded! Great job!")