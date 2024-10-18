const dogs =
 [{ 'breed': 'Aspin', 'size': 'medium' },
{ 'breed': 'Beagle', 'size': 'medium' },
{ 'breed': 'Chihuahua', 'size': 'small' },
{ 'breed': 'Corgi', 'size': 'medium' },
{ 'breed': 'Dalmatian', 'size': 'medium' },
{ 'breed': 'English Bulldog', 'size': 'medium' },
{ 'breed': 'French Bulldog', 'size': 'small' },
{ 'breed': 'German Shepherd', 'size': 'large' },
{ 'breed': 'Golden Retriever', 'size': 'large' },
{ 'breed': 'Labrador', 'size': 'large' },
{ 'breed': 'Pomeranian', 'size': 'small' },
{ 'breed': 'Poodle', 'size': 'medium' },
{ 'breed': 'Pug', 'size': 'small' },
{ 'breed': 'Shih Tzu', 'size': 'small' },
{ 'breed': 'Siberian Husky', 'size': 'medium' }]

// AGES ARE IN MONTHS
const ages = {
    "adult": { "small": 6, "medium": 8, "large": 12 },
    "senior": { "small": 120, "medium": 96, "large": 72 }
}

const foods = {
    "adult":
        [{ 'brand': 'Pedigree', 'price': 606, 'desc': 'High Quality' },
        { 'brand': 'Aozi', 'price': 330, 'desc': 'Organic' },
        { 'brand': 'Vitality', 'price': 210, 'desc': 'Premium' },
        { 'brand': 'Goodboy ', 'price': 72, 'desc': 'Low Price' },
        { 'brand': 'Nutri Chunks', 'price': 360, 'desc': 'Mid Price' },
        { 'brand': 'Royal Canin', 'price': 600, 'desc': 'For small dogs' },
        { 'brand': 'TopBreed', 'price': 80, 'desc': 'Low Price' }],
    "puppy":
        [{ 'brand': 'Pedigree', 'price': 706, 'desc': 'High Quality' },
        { 'brand': 'Aozi', 'price': 370, 'desc': 'Organic' },
        { 'brand': 'Vitality', 'price': 245, 'desc': 'Premium' },
        { 'brand': 'Goodboy ', 'price': 93, 'desc': 'Low Price' },
        { 'brand': 'Nutri Chunks', 'price': 381, 'desc': 'Mid Price' },
        { 'brand': 'Royal Canin', 'price': 730, 'desc': 'For small dogs' },
        { 'brand': 'TopBreed', 'price': 85, 'desc': 'Low Price' }]
}

const foodAmount = {
    "puppy": {
        "small": { "min": 50, "max": 125 },
        "medium": { "min": 150, "max": 275 },
        "large": { "min": 250, "max": 400 }
    },
    "adult": {
        "small": { "min": 75, "max": 150 },
        "medium": { "min": 175, "max": 267 },
        "large": { "min": 300, "max": 450 }
    },
    "senior": {
        "small": { "min": 60, "max": 120 },
        "medium": { "min": 160, "max": 220 },
        "large": { "min": 250, "max": 350 }
    }
}


$(document).ready(() => {

    // Populate the dog breeds dropdown
    dogs.forEach((dog) => {
        let html = `<option value="${dog['breed']}">${dog['breed']}</option>`;
        $('#dogBreeds').append(html);
    });

    // Populate the puppy dog foods
    foods['puppy'].forEach((puppyFood) => {
        const text = `${puppyFood['brand']} P${puppyFood['price']}/kg (${puppyFood['desc']})`
        const html = `<option value="${puppyFood['brand']}">${text}</option>`;
        $('#puppyFoods').append(html);
    });
    $('#puppyFoods').append(`<option value="Custom">Custom</option>`);

    // Populate the adult dog foods
    foods['adult'].forEach((adultFood) => {
        const text = `${adultFood['brand']} P${adultFood['price']}/kg (${adultFood['desc']})`
        const html = `<option value="${adultFood['brand']}">${text}</option>`;
        $('#adultFoods').append(html);
    });
    $('#adultFoods').append(`<option value="Custom">Custom</option>`);

    $(".custom-price-wrapper").hide()


    // Hide second and third displays initially``
    // $("#firstDisplay").hide();
    $("#secondDisplay").hide();
    $("#thirdDisplay").hide();

});

let choiceDog, puppyFoodChoice, adultFoodChoice
let daily, monthly, yearly,fy


function showDisplay (display) {
    if (display == 1){
        $("#thirdDisplay").hide()
        $("#firstDisplay").show()
    }
    else if (display == 2){
        $("#firstDisplay").hide()
        $("#secondDisplay").show()
        
        if (choiceDog['maturity'] !== "puppy") {
            $("#puppyFoodWrapper").hide();
        } else{
            $("#puppyFoodWrapper").show();
        }

    }
    else if (display == 3){
        $("#secondDisplay").hide()
        $("#thirdDisplay").show()
        showSummary()

    }
}

function calculate() {

    
    // PUPPY
    if (choiceDog['maturity'] === "puppy") {
        // EXPENSE ON FIRST YEAR AS A PUPPY AND ADULT
        calculateFy();
        // EXPENSE ON PRECEDING YEARS AS AN ADULT
        calculateAfy("adult");
    } else {   // ADULT / SENIOR
        calculateAfy(choiceDog['maturity']);
    }

    // CALCULATE FIRST YEAR
    function calculateFy() {
        const puppyMonths = choiceDog['adultAge'] - choiceDog['age'];
        const adultMonths = 12 - puppyMonths;

        const fyPuppyMin = puppyMonths * 30 * puppyFoodChoice['price'] * getFoodAmount('puppy', 'min');
        const fyPuppyMax = puppyMonths * 30 * puppyFoodChoice['price'] * getFoodAmount('puppy', 'max');
        const fyAdultMin = adultMonths * 30 * adultFoodChoice['price'] * getFoodAmount('adult', 'min');
        const fyAdultMax = adultMonths * 30 * adultFoodChoice['price'] * getFoodAmount('adult', 'max');
        
        const fyMin = fyPuppyMin + fyAdultMin;
        const fyMax = fyPuppyMax + fyAdultMax;
        fy = `${toPesoFormat(fyMin)} - ${toPesoFormat(fyMax)}`;
    }
    
    function calculateAfy(maturity) {
        // CALCULATE AFTER FIRST YEAR
        const dayMax = adultFoodChoice['price'] * getFoodAmount(maturity, 'max');
        const dayMin = adultFoodChoice['price'] * getFoodAmount(maturity, 'min');
        const monthMin = dayMin * 30;
        const monthMax = dayMax * 30;
        const yearMin = monthMin * 12;
        const yearMax = monthMax * 12;

        daily = `${toPesoFormat(dayMin)} - ${toPesoFormat(dayMax)}`;
        monthly = `${toPesoFormat(monthMin)} - ${toPesoFormat(monthMax)}`;
        yearly = `${toPesoFormat(yearMin)} - ${toPesoFormat(yearMax)}`;
    }

    function getFoodAmount(maturity, threshold) {
        const g = foodAmount[maturity][choiceDog['size']][threshold];
        return g / 1000;
    }

    function toPesoFormat(number) {
        number = Math.trunc(number)
        number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `₱${number}`;
    }
}

function showSummary () {
    
    $('#expenseSummary').append(`<h3>EXPENSE SUMMARY:</h3>`);

    if (choiceDog['maturity'] === "puppy") {
        // First Year Section
        $('#expenseSummary').append(`<span><strong>First Year:</strong></span>`);
        $('#expenseSummary').append(`<span>${getDailyFood(choiceDog['size'], 'puppy')}</span>`);
        $('#expenseSummary').append(`<span>Total: <strong>${fy}</strong></span>`);

        // Preceding Years Section
        $('#expenseSummary').append(`<br>`);
        $('#expenseSummary').append(`<span><strong>Preceding Years:</strong></span>`);
        $('#expenseSummary').append(`<span>${getDailyFood(choiceDog['size'], 'adult')}</span>`);
        $('#expenseSummary').append(`<span><strong>${daily}</strong> per day</span>`);
        $('#expenseSummary').append(`<span><strong>${monthly}</strong> per month</span>`);
        $('#expenseSummary').append(`<span><strong>${yearly}</strong> per year</span>`);
    } else {
        // Adult or Senior Section
        $('#expenseSummary').append(`<span><strong>Daily, Monthly, Yearly:</strong></span>`);
        $('#expenseSummary').append(`<span>  ${getDailyFood(choiceDog['size'], choiceDog['maturity'])}</span>`);
        $('#expenseSummary').append(`<span><strong>${daily}</strong> per day</span>`);
        $('#expenseSummary').append(`<span><strong>${monthly}</strong> per month</span>`);
        $('#expenseSummary').append(`<span><strong>${yearly}</strong> per year</span>`);
    }


    function getDailyFood(size, maturity) {
        const amount = `${foodAmount[maturity][size]['min']}g-${foodAmount[maturity][size]['max']}g`;
        const frequency = (maturity === "puppy") ? "twice a day" : "thrice a day";
        return `Feed ${frequency}, total of ${amount}`;
    }

}

// FIRST DISPLAY
$('#firstDisplay input[value="NEXT"').click(function () {

    let breed = $("#dogBreeds").val()
    let dogAge = $("#dogAge").val()

    // AGE VALIDATION
    if (dogAge == "" || dogAge <= 2 || dogAge >= 360) {
        $('#ageError').addClass('visible')

        return
    } else {
        $("#ageError").removeClass('visible')
        dogAge = parseInt(dogAge)
    }

    // GET DOG OBJECT FROM SELECTED BREED
    dogs.forEach( (dog) => {
        if (breed == dog['breed']) {
            choiceDog = dog
        }
    })

    // GET SIZE, ADULT AGE, MATURITY 
    const size = choiceDog['size']
    const adultAge = ages["adult"][size]
    const maturity = dogAge < ages["adult"][size] ? "puppy" :(dogAge < ages["senior"][size] ? "adult" : "senior");


    // COMPLETE DOG CHARACTERISTICS
    choiceDog =  {...choiceDog,  "maturity" : maturity, 'age' : dogAge, 'age' : dogAge, "adultAge": adultAge};

    showDisplay(2)
  
});

// SECOND DISPLAY
$('#secondDisplay input[value="NEXT"]').click(function () {
    puppyFoodChoice = $("#puppyFoods").val()
    adultFoodChoice = $("#adultFoods").val()
    let puppyCustomPrice = $("#puppyCustomPrice").val()
    let adultCustomPrice = $("#adultCustomPrice").val()


    if (choiceDog['maturity'] == "puppy"){
        if(puppyFoodChoice == "Custom" ) {
        // MAKE CUSTOM PUPPY FOOD OBJECT
        puppyFoodChoice = { 'brand': 'Custom', 'price': puppyCustomPrice, 'desc': '' }
    } else {
        // GET PUPPY FOOD OBJECT
        for (let puppyFood of foods['puppy']) {
            if (puppyFoodChoice.includes(puppyFood['brand'])) {
                puppyFoodChoice = puppyFood;
                break;  // Exit the loop when the condition is satisfied
            }
        }
    }

    }
  
    if (adultFoodChoice == "Custom") {
        // MAKE CUSTOM adult FOOD OBJECT
        adultFoodChoice = { 'brand': 'Custom', 'price': adultCustomPrice, 'desc': '' }
    } else {
        // GET ADULT FOOD OBJECT
        for (let adultFood of foods['adult']) {
            if (adultFoodChoice.includes(adultFood['brand'])) {
                adultFoodChoice = adultFood;
                break;  // Exit the loop when the condition is satisfied
            }
        }
    }
    console.log("puppy", puppyFoodChoice);
    console.log("adult", adultFoodChoice);

    calculate()
    showDisplay(3)

})

// THIRD DISPLAY
$('#thirdDisplay input[value="CALCULATE AGAIN"]').click(function () {
    $('select').prop('selectedIndex', 0); // Reset dropdown to the first option
    $(".custom-price-wrapper").hide()
    $('#expenseSummary').text('');
    $('input[type="number"]').val('');
    showDisplay(1)
});


$('.dropdown-food').on('change', function () {
    
    if (this.value == 'Custom') {
        $(this).siblings(".custom-price-wrapper").show()
    } else {
        $(this).siblings(".custom-price-wrapper").hide()
    }

});

console.log(true);