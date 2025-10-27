def calculate_sum(a, b):
    return a + b

def calculate_product(a, b):
    return a * b

def main():
    x = 5
    y = 0  # This will cause a division by zero error
    sum_result = calculate_sum(x, y)
    print(f"Sum: {sum_result}")

    product_result = calculate_product(x, y)
    print(f"Product: {product_result}")

if __name__ == "__main__":
    main()