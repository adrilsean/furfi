import tkinter as tk

class DogExpenseCalculator:
    def __init__(self, root):
        self.root = root
        self.dogs = [{'breed': 'Aspin', 'size': 'medium'}, 
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
        self.ages = {"adult": {"small": 6, "medium": 8, "large": 12},
                     "senior": {"small": 120, "medium": 96, "large": 72}}
        self.foods = {"adult": [
                {"brand": "Pedigree", "price": 606, "desc": "High Quality"},
                {"brand": "Aozi", "price": 330, "desc": "Organic"},
                {"brand": "Vitality", "price": 210, "desc": "Premium"},
                {"brand": "Goodboy", "price": 72, "desc": "Low Price"},
                {"brand": "Nutri Chunks", "price": 360, "desc": "Mid Price"},
                {"brand": "Royal Canin", "price": 600, "desc": "For small dogs"},
                {"brand": "TopBreed", "price": 80, "desc": "Low Price"}
            ],
            "puppy": [
                {"brand": "Pedigree", "price": 706, "desc": "High Quality"},
                {"brand": "Aozi", "price": 370, "desc": "Organic"},
                {"brand": "Vitality", "price": 245, "desc": "Premium"},
                {"brand": "Goodboy", "price": 93, "desc": "Low Price"},
                {"brand": "Nutri Chunks", "price": 381, "desc": "Mid Price"},
                {"brand": "Royal Canin", "price": 730, "desc": "For small dogs"},
                {"brand": "TopBreed", "price": 85, "desc": "Low Price"}
            ]
        }
        self.food_amount = { "puppy": {
                "small": {"min": 50, "max": 125},
                "medium": {"min": 150, "max": 275},
                "large": {"min": 250, "max": 400}
            },
            "adult": {
                "small": {"min": 75, "max": 150},
                "medium": {"min": 175, "max": 267},
                "large": {"min": 300, "max": 450}
            },
            "senior": {
                "small": {"min": 60, "max": 120},
                "medium": {"min": 160, "max": 220},
                "large": {"min": 250, "max": 350}
            }
        }

        self.start_first_display()

    def clear_widgets(self):
        for widget in self.root.winfo_children():
            widget.destroy()

    def start_first_display(self):
        self.clear_widgets()
        
        self.choice_breed = None
        self.choice_age = None
        self.breeds = [dog['breed'] for dog in self.dogs]
        
        # BREED DROPDOWN
        self.create_label(text="Choose your dog's breed:")
        self.input_breed = tk.StringVar()
        self.input_breed.set(self.breeds[0]) 
        self.drop_breed = tk.OptionMenu(self.root, self.input_breed, *self.breeds)
        self.drop_breed.pack()
        
        # AGE INPUT FIELD
        self.create_label(text="Enter dog's age in months:")
        self.input_age = self.create_entry()
        
        # AGE ERROR VALIDATION PROMPT
        self.error_prompt = self.create_label(color="red")

        # NEXT BUTTON
        next_button = tk.Button(self.root, text="Next", command=self.on_next)
        next_button.pack()

    def start_second_display(self, maturity):
        self.clear_widgets()
        self.maturity = maturity
        
        self.foods_puppy = self.foods_choices(self.foods['puppy'])
        self.foods_adult = self.foods_choices(self.foods['adult'])
        
        # SHOW PUPPY DOGFOOD SELECTIONS
        if self.maturity == "puppy":
            self.create_label("Choose your puppy dog food:")
            self.input_food_puppy, self.drop_food_puppy = self.create_dropdown(self.foods_puppy, "puppy")

            # PUPPY DOGFOOD CUSTOM VALIDATION
            self.puppy_custom_label = self.create_label()
            # self.puppy_custom_label = self.create_label("Enter custom puppy food price:")
            self.puppy_custom = self.create_entry(hidden=True)
            self.puppy_error_prompt = self.create_label(color="red")


        # SHOW ADULT DOGFOOD SELECTIONS
        self.create_label("Choose your adult dog food:")
        self.input_food_adult, self.drop_food_adult = self.create_dropdown(self.foods_adult, "adult")

        # ADULT DOGFOOD CUSTOM PRICE VALIDATION
        self.adult_custom_label = self.create_label()
        # self.adult_custom_label = self.create_label("Enter custom adult food price:")
        self.adult_custom = self.create_entry(hidden=True)
        self.adult_error_prompt = self.create_label(color="red")

        # FINISH BUTTON
        finish_button = tk.Button(self.root, text="Finish", command=self.on_finish)
        finish_button.pack()

    def start_third_display(self):
            self.clear_widgets()
            dog = {**self.choice_dog, "age": self.choice_age, "maturity": self.maturity, "adult_age": self.ages["adult"][self.choice_dog['size']]}
            self.dog = dog
            
            self.food_puppy = self.food_puppy
            self.food_adult = self.food_adult

            # CALCULATE FIRST YEAR AND AFTER FIRST YEAR (PRECEDING YEARS)
            if self.dog['maturity'] == "puppy":
                # EXPENSE ON FIRST YEAR AS A PUPPY AND ADULT
                self.puppy_months = dog['adult_age'] - self.dog['age']
                self.adult_months = 12 - self.puppy_months
                self.fy = self.calculate_fy()
                # EXPENSE ON PRECEDING YEARS AS AN ADULT
                self.daily, self.monthly, self.yearly = self.calculate_afy("adult")
                
            # CALCULATE DAILY, MONTHLY YEARLY (NO FIRST YEAR)
            self.daily, self.monthly, self.yearly = self.calculate_afy(self.dog['maturity'])

            # Summary calculation and display
            self.show_summary()

    def show_summary(self):
        # Heading
        self.create_label(f"Expense Summary", font=("Arial", 16, "bold"))
        self.create_label(f"{self.dog['breed']} ({self.dog['age']} months old):", font=("Arial", 14, "bold"))

        # First Year Expense (if puppy)
        if self.dog['maturity'] == "puppy":
            self.create_label("First Year:", font=("Arial", 12, "bold"))
            self.create_label(f"  {self.get_daily_food(self.dog['size'], 'puppy')}")
            self.create_label(f"  Total: {self.fy}")

            self.create_label("Preceding Years:", font=("Arial", 12, "bold"))
            self.create_label(f"  {self.get_daily_food(self.dog['size'], 'adult')}")
            self.create_label(f"  {self.daily} per day")
            self.create_label(f"  {self.monthly} per month")
            self.create_label(f"  {self.yearly} per year")
        else:
            self.create_label("Daily, Monthly, Yearly", font=("Arial", 12, "bold"))
            self.create_label(f"  {self.get_daily_food(self.dog['size'], self.dog['maturity'])}")
            self.create_label(f"  {self.daily} per day")
            self.create_label(f"  {self.monthly} per month")
            self.create_label(f"  {self.yearly} per year")

        # Buttons
        calculate_again_button = tk.Button(self.root, text="Calculate Again", command=self.start_first_display)
        calculate_again_button.pack(pady=5)

    def foods_choices(self, food_group):
        choices = []
        for choice in food_group:
            choices.append((f"{choice['brand']}, P{choice['price']}/kg ({choice['desc']}) "))
        choices.append("Custom Price")
        return choices
    
    def get_food_amount(self, maturity, threshold):
        g = self.food_amount[maturity][self.dog['size']][threshold]
        return g/1000
    
    def get_daily_food(self, size, maturity):
        amount = f"{self.food_amount[maturity][size]['min']}g-{self.food_amount[maturity][size]['max']}g"
        frequency = "twice a day" if maturity == "puppy" else "thrice a day"    
        return f"Feed {frequency}, total of {amount}"  

    def to_peso_format(self, number):
        return f"₱{int(number):,}"  

    def calculate_fy(self):
        fy_puppy_min = self.puppy_months * 30 * self.food_puppy['price'] * self.get_food_amount('puppy', 'min')
        fy_puppy_max = self.puppy_months * 30 * self.food_puppy['price'] * self.get_food_amount('puppy', 'max')
        
        fy_adult_min = self.adult_months * 30 * self.food_adult['price'] * self.get_food_amount('adult', 'min')
        fy_adult_max = self.adult_months * 30 * self.food_adult['price'] * self.get_food_amount('adult', 'max')
        
        fy_min = fy_puppy_min + fy_adult_min
        fy_max = fy_puppy_max + fy_adult_max
        
        return f"{self.to_peso_format(fy_min)} to {self.to_peso_format(fy_max)}"
    
    def calculate_afy(self, maturity):
        
        maturity = "adult" if maturity == "puppy" else maturity
        
        day_max = self.food_adult['price'] * self.get_food_amount(maturity, 'max')
        day_min = self.food_adult['price'] * self.get_food_amount(maturity, 'min')

        month_min = day_min * 30
        month_max = day_max * 30
        year_min = month_min * 12
        year_max = month_max * 12
        
        daily = f"{self.to_peso_format(day_min)} - {self.to_peso_format(day_max)}"
        monthly = f"{self.to_peso_format(month_min)} - {self.to_peso_format(month_max)}"
        yearly = f"{self.to_peso_format(year_min)} - {self.to_peso_format(year_max)}"
        
        return daily, monthly, yearly

    def create_label(self, text="", color="black",font=None,):
        label = tk.Label(self.root, font=font, text=text, fg=color)
        label.pack()
        return label

    def create_entry(self, hidden=False):
        entry = tk.Entry(self.root)
        if not hidden:
            entry.pack()
        return entry

    def create_dropdown(self, options, dropdown_type):
        dropdown_var = tk.StringVar()
        dropdown_var.set(options[0])
        dropdown_var.trace_add("write", lambda *args: self.on_change(dropdown_type))
        dropdown_menu = tk.OptionMenu(self.root, dropdown_var, *options)
        dropdown_menu.pack()
        return dropdown_var, dropdown_menu

    def on_change(self, dropdown):
        if dropdown == "puppy":
            if self.input_food_puppy.get() == "Custom Price":
                self.puppy_custom_label.config(text="Enter custom puppy food price:")
                self.puppy_custom.pack(after=self.puppy_custom_label)
            else:
                self.puppy_custom_label.config(text="")
                self.puppy_custom.pack_forget()
        elif dropdown == "adult":
            if self.input_food_adult.get() == "Custom Price":
                self.adult_custom_label.config(text="Enter custom adult food price:")
                self.adult_custom.pack(after=self.adult_custom_label)
            else:
                self.adult_custom_label.config(text="")
                self.adult_custom.pack_forget()

    def on_next(self):
            self.choice_breed = self.input_breed.get()
            self.choice_age = self.input_age.get()
            
            if not self.choice_age.isdigit() or int(self.choice_age) not in range(2 + 1, 360):
                self.error_prompt.config(text="Please enter a number between 2 and 360 months")
                return
            
            self.choice_age = int(self.choice_age)
            self.choice_dog = None
            for dog in self.dogs:
                if dog['breed'] == self.choice_breed:
                    self.choice_dog = dog
                    break
            
            size = self.choice_dog['size']
            maturity = "puppy" if self.choice_age < self.ages["adult"][size] else "adult" if self.choice_age < self.ages["senior"][size] else "senior"
            
            self.start_second_display(maturity)

    def on_finish(self):
        is_valid = True  # Assume valid input initially
        
        self.food_puppy = None
        self.food_adult = None
        
        if self.maturity == "puppy":
            if self.input_food_puppy.get() == "Custom Price":
                if not self.puppy_custom.get().isdigit() or int(self.puppy_custom.get()) < 1:
                    self.puppy_error_prompt.config(text="Please enter a valid price")
                    self.puppy_error_prompt.pack()
                    is_valid = False
                else:
                    self.food_puppy = {"brand": "Custom", "price": int(self.puppy_custom.get()), "desc": ""}
            else:
                for food in self.foods['puppy']:
                    if food['brand'] in self.input_food_puppy.get():
                        self.food_puppy = food
                        break

        if self.input_food_adult.get() == "Custom Price":
            if not self.adult_custom.get().isdigit() or int(self.adult_custom.get()) < 1:
                self.adult_error_prompt.config(text="Please enter a valid price")
                self.adult_error_prompt.pack()
                is_valid = False
            else:
                self.food_adult = {"brand": "Custom", "price": int(self.adult_custom.get()), "desc": ""}
        else:
            for food in self.foods['adult']:
                if food['brand'] in self.input_food_adult.get():
                    self.food_adult = food
                    break
        
        if is_valid:
            self.start_third_display()

   
        
if __name__ == "__main__":
    root = tk.Tk()
    root.geometry("400x300")
    root.title("Dog Food Expense Calculator")
    app = DogExpenseCalculator(root)
    root.mainloop()
