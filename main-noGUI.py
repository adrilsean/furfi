dogs = [{'breed': 'Aspin', 'size': 'medium'}, 
        {'breed': 'Beagle', 'size': 'medium'},
        {'breed': 'Chihuahua', 'size': 'small'}, 
        {'breed': 'Corgi', 'size': 'medium'}, 
        {'breed': 'Dalmatian', 'size': 'medium'}, 
        {'breed': 'English Bulldog', 'size': 'medium'}, 
        {'breed': 'French Bulldog', 'size': 'small'}, 
        {'breed': 'German Shepherd', 'size': 'large'}, 
        {'breed': 'Golden Retriever', 'size': 'large'}, 
        {'breed': 'Labrador', 'size': 'large'},
        {'breed': 'Pomeranian', 'size': 'small'}, 
        {'breed': 'Poodle', 'size': 'medium'}, 
        {'breed': 'Pug', 'size': 'small'}, 
        {'breed': 'Shih Tzu', 'size': 'small'}, 
        {'breed': 'Siberian Husky', 'size': 'medium'}]

# AGES ARE IN MONTHS
ages = {"adult" :{"small": 6, "medium": 8, "large": 12}, 
        "senior" :{"small": 120,"medium": 96,"large": 72}  }

foods = {
  "adult": [
    { "brand": "Pedigree", "price": 606, "desc": "High Quality" },
    { "brand": "Aozi", "price": 330, "desc": "Organic" },
    { "brand": "Vitality", "price": 210, "desc": "Premium" },
    { "brand": "Goodboy", "price": 72, "desc": "Low Price" },
    { "brand": "Nutri Chunks", "price": 360, "desc": "Mid Price" },
    { "brand": "Royal Canin", "price": 600, "desc": "For small dogs" },
    { "brand": "TopBreed", "price": 80, "desc": "Low Price" },
  ],
  "puppy": [
    { "brand": "Pedigree", "price": 706, "desc": "High Quality" },
    { "brand": "Aozi", "price": 370, "desc": "Organic" },
    { "brand": "Vitality", "price": 245, "desc": "Premium" },
    { "brand": "Goodboy", "price": 93, "desc": "Low Price" },
    { "brand": "Nutri Chunks", "price": 381, "desc": "Mid Price" },
    { "brand": "Royal Canin", "price": 730, "desc": "For small dogs" },
    { "brand": "TopBreed", "price": 85, "desc": "Low Price" },
  ],
}

food_amount = {
    "small": {
        "puppy": {"min": 50, "max": 125},
        "adult": {"min": 75, "max": 150},
        "senior": {"min": 60, "max": 120}  
    },
    "medium": {
        "puppy": {"min": 150, "max": 275},
        "adult": {"min": 175, "max": 267},
        "senior": {"min": 160, "max": 220} 
    },
    "large": {
        "puppy": {"min": 250, "max": 400},
        "adult": {"min": 300, "max": 450},
        "senior": {"min": 250, "max": 350}  
    }
}

def int_input(prompt):
    while True:
        try:
            # Ask for input
            user_input = input(prompt)
            # Attempt to convert to integer
            value = int(user_input)
            return value  # Return the valid integer
        except ValueError:
            # Catch the ValueError and print an error message
            print("Invalid input. Please enter a number.")

def to_kg(g):
    return g/1000

def to_peso_format(number):
    return f"₱{int(number):,}"

def get_maturity(size, age):
    if age < ages['adult'][size]:
        return "puppy"
    elif age < ages['senior'][size]:
        return "adult"
    else:
        return "senior"
  
def get_daily_food(size, maturity):
    
    amount = f"{food_amount[size][maturity]['min']}g-{food_amount[size][maturity]['max']}g"
    
    if maturity == "puppy" :
        frequency = "thrice a day"
    else:
        frequency = "twice a day"
        
    frequency = "twice a day" if maturity == "puppy" else "thrice a day"    
    return f"Feed {frequency}, total of {amount}"  
    
def input_age():
    age  = int_input("\nEnter an age between 2 and 360 months: ")  
        
    if 2 <= age < 360:
        return age
    else:
        print(f"Invalid age, please try again.\n")
        return input_age()

def display_breeds():
    print(f"\nBreeds:")
    number = 1
    for dog in dogs:
        print(f"{number}. {dog['breed']}")
        number += 1

def choose_breed():
    display_breeds()
    choices = list(range(1, len(dogs) + 1))    
    choice = int_input((f"Choose a dog breed (1-{len(dogs)}): "))
    
    if choice in choices:
        return dogs[choice-1]
    else:
        print(f"Invalid choice, please try again.\n")
        return choose_breed()

def display_foods(maturity, food_group):
    print(f"\nDog foods for {maturity} :")
    number = 1
    for choice in food_group:
        print(f"{number}. {choice['brand']}, P{choice['price']}/kg ({choice['desc']}) ")
        number += 1

def choose_food(maturity):
    
    maturity = "adult" if maturity == "senior" else maturity
    food_group = foods[maturity]
    display_foods(maturity, food_group)
    
    choices = list(range(1, len(food_group) + 1))    
    choice = int_input((f"Choose a dog food (1-{len(choices)}), Enter '0' to enter custom price: "))
    
    if choice in choices:
        return food_group[choice-1]
    elif choice == 0:
        price = int_input((f"Enter your {maturity} dog food's price: "))
        custom_food = {'brand' : 'Custom', 'price' : price, 'desc': ''}
        return custom_food
    else:
        print(f"Invalid choice, please try again.\n")
        return choose_food(maturity) 
 
def calculate_expense(price, food_amount_min, food_amount_max):
    day_min = price * to_kg(food_amount_min)
    day_max = price * to_kg(food_amount_max)
    
    month_min = day_min * 30
    month_max = day_max * 30
    year_min = month_min * 12
    year_max = month_max * 12
    
    daily = f"{to_peso_format(day_min)} - {to_peso_format(day_max)}"
    monthly = f"{to_peso_format(month_min)} - {to_peso_format(month_max)}"
    yearly = f"{to_peso_format(year_min)} - {to_peso_format(year_max)}"
    
    return daily, monthly, yearly

def calculate_fy_expense(puppy_months, adult_months, food_puppy, food_adult, size):
    fy_puppy_min = puppy_months * 30 * food_puppy['price'] * to_kg(food_amount[size]['puppy']['min'])
    fy_puppy_max = puppy_months * 30 * food_puppy['price'] * to_kg(food_amount[size]['puppy']['max'])
    
    fy_adult_min = adult_months * 30 * food_adult['price'] * to_kg(food_amount[size]['adult']['min'])
    fy_adult_max = adult_months * 30 * food_adult['price'] * to_kg(food_amount[size]['adult']['max'])
    
    fy_min = fy_puppy_min + fy_adult_min
    fy_max = fy_puppy_max + fy_adult_max
    
    return f"{to_peso_format(fy_min)} to {to_peso_format(fy_max)}"
 
def main() :    
    # TAKE USER INPUTS
    breed = choose_breed()
    size = breed['size']
    age = input_age()
    adult_age = ages['adult'][size]
    maturity = get_maturity(size, age)
    food_puppy = choose_food(maturity) if maturity == 'puppy' else None             
    food_adult = choose_food("adult")  
    
    dog = {"breed": breed["breed"], "age" : age, "maturity": maturity, "size" : size}

    if maturity == "puppy":
        # EXPENSE ON FIRST YEAR AS A PUPPY AND ADULT
        puppy_months = adult_age - age
        adult_months = 12 - puppy_months
        
        fy = calculate_fy_expense(puppy_months, adult_months, food_puppy, food_adult, size)

        
        # EXPENSE ON PRECEDING YEARS AS AN ADULT
        daily, monthly, yearly = calculate_expense(
            food_adult['price'],
            food_amount[size]['adult']['min'],
            food_amount[size]['adult']['max'] )
        
    else:
        # EXPENSE AS AN ADULT OR SENIOR
        daily, monthly, yearly = calculate_expense(
            food_adult['price'],
            food_amount[size][maturity]['min'],
            food_amount[size][maturity]['max'])
        
        fy = "P0-P0"
        
    
    display_summary(dog, fy, daily, monthly, yearly)
    calculate_again()
    
def display_summary(dog, fy, daily, monthly, yearly):
    
    print(f"\nExpense Summary: {dog['breed']} ({dog['age']} months old) expense summary:\n")
    
    if (dog['maturity'] == "puppy"):
        print("- First Year:")
        print(f"  {get_daily_food(dog['size'], 'puppy')}")
        print(f"  Total: {fy}")

        print("\n- Preceding Years:")
        print(f"  {get_daily_food(dog['size'], 'adult')}")
        print(f"  {daily} per day")
        print(f"  {monthly} per month")
        print(f"  {yearly} per year")

    else:
        print("- Daily, monthly, yearly:")
        print(f"  {get_daily_food(dog['size'], dog['maturity'])}")
        print(f"  {daily} per day")
        print(f"  {monthly} per month")
        print(f"  {yearly} per year")

    
def calculate_again():
    response  = input(f"\nCalculate again? (yes/no): ").strip().lower() 
                
    if response == "yes":
        main()
    elif response != "no":
        print("Invalid response, try again.")
        calculate_again()

main()         


                                    

