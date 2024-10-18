const dogs = [
  { breed: "Aspin", size: "medium" },
  { breed: "Beagle", size: "medium" },
  { breed: "Chihuahua", size: "small" },
  { breed: "Corgi", size: "medium" },
  { breed: "Dalmatian", size: "medium" },
  { breed: "English Bulldog", size: "medium" },
  { breed: "French Bulldog", size: "small" },
  { breed: "German Shepherd", size: "large" },
  { breed: "Golden Retriever", size: "large" },
  { breed: "Labrador", size: "large" },
  { breed: "Pomeranian", size: "small" },
  { breed: "Poodle", size: "medium" },
  { breed: "Pug", size: "small" },
  { breed: "Shih Tzu", size: "small" },
  { breed: "Siberian Husky", size: "medium" },
];

// AGES ARE IN MONTHS
const ages = {
  adult: { small: 6, medium: 8, large: 12 },
  senior: { small: 120, medium: 96, large: 72 },
};

const foods = {
  adult: [
    { brand: "Pedigree", price: 606, desc: "High Quality" },
    { brand: "Aozi", price: 330, desc: "Organic" },
    { brand: "Vitality", price: 210, desc: "Premium" },
    { brand: "Goodboy", price: 72, desc: "Low Price" },
    { brand: "Nutri Chunks", price: 360, desc: "Mid Price" },
    { brand: "Royal Canin", price: 600, desc: "For small dogs" },
    { brand: "TopBreed", price: 80, desc: "Low Price" },
  ],
  puppy: [
    { brand: "Pedigree", price: 706, desc: "High Quality" },
    { brand: "Aozi", price: 370, desc: "Organic" },
    { brand: "Vitality", price: 245, desc: "Premium" },
    { brand: "Goodboy", price: 93, desc: "Low Price" },
    { brand: "Nutri Chunks", price: 381, desc: "Mid Price" },
    { brand: "Royal Canin", price: 730, desc: "For small dogs" },
    { brand: "TopBreed", price: 85, desc: "Low Price" },
  ],
};

const foodAmount = {
  puppy: {
    small: { min: 50, max: 125 },
    medium: { min: 150, max: 275 },
    large: { min: 250, max: 400 },
  },
  adult: {
    small: { min: 75, max: 150 },
    medium: { min: 175, max: 267 },
    large: { min: 300, max: 450 },
  },
  senior: {
    small: { min: 60, max: 120 },
    medium: { min: 160, max: 220 },
    large: { min: 250, max: 350 },
  },
};

$(document).ready(() => {
  // Populate the dog breeds dropdown
  dogs.forEach((dog) => {
    const html = `<div class="option">
                <img src="/Pictures/${dog["breed"]}.jpg" alt="">
                <div class="text">${dog["breed"]}</div>
              </div>`;
    $("#dogBreedsOptions").append(html);
  });

  // Populate the puppy dog foods
  foods["puppy"].forEach((puppyFood) => {
    const text = `${puppyFood["brand"]} ₱${puppyFood["price"]}/kg (${puppyFood["desc"]})`;
    const html = `<div class="option">
    <img src="/Pictures/${puppyFood["brand"]}.jpg" alt="">
    <div class="text">${text}</div>
    </div>`;
    $("#puppyFoodsOptions").append(html);
  });
  $("#puppyFoodsOptions").append(`<div class="option">
    <img src="/Pictures/Peso.jpg" alt="">
    <div class="text">Custom price</div>
    </div>`);

  // Populate the adult dog foods
  foods["adult"].forEach((adultFood) => {
    const text = `${adultFood["brand"]} ₱${adultFood["price"]}/kg (${adultFood["desc"]})`;
    const html = `<div class="option">
    <img src="/Pictures/${adultFood["brand"]}.jpg" alt="">
    <div class="text">${text}</div>
  </div>`;
    $("#adultFoodsOptions").append(html);
  });
  $("#adultFoodsOptions").append(`<div class="option">
  <img src="/Pictures/Peso.jpg" alt="">
  <div class="text">Custom price</div>
  </div>`);

  // $(".custom-price-wrapper").hide()

  // Hide second and third displays initially``
  $("#secondDisplay").hide();

  $(".option").on("mousedown touchstart", function () {
    const text = $(this).text().trim();
    $(this).parent().siblings(".select").val(text);
    $("#firstDisplay").trigger("change");
  });

  $(".select").on("focus", function () {
    $(this).siblings(".options").addClass("visible");
  });

  $(".select").on("blur", function () {
    $(this).siblings(".options").removeClass("visible");
  });
});

let choiceDog, breed, dogAge, maturity, size, puppyFoodChoice, adultFoodChoice;
let daily, monthly, yearly, fy;
let activeDisplay = 1;

function showDisplay(display) {
  if (display == 1) {
    activeDisplay = 1;
    $("#secondDisplay").hide();
    $("#firstDisplay").show();
  } else if (display == 2) {
    activeDisplay = 2;
    $("#firstDisplay").hide();
    $("#secondDisplay").show();
    showSummary();
  }
}

function calculate() {
  // PUPPY
  if (choiceDog["maturity"] === "puppy") {
    // EXPENSE ON FIRST YEAR AS A PUPPY AND ADULT
    calculateFy();
    // EXPENSE ON PRECEDING YEARS AS AN ADULT
    calculateAfy("adult");
  } else {
    // ADULT / SENIOR
    calculateAfy(choiceDog["maturity"]);
  }

  // CALCULATE FIRST YEAR
  function calculateFy() {
    const puppyMonths = choiceDog["adultAge"] - choiceDog["age"];
    const adultMonths = 12 - puppyMonths;

    const fyPuppyMin = puppyMonths * 30 * puppyFoodChoice["price"] * getFoodAmount("puppy", "min");
    const fyPuppyMax = puppyMonths * 30 * puppyFoodChoice["price"] * getFoodAmount("puppy", "max");
    const fyAdultMin = adultMonths * 30 * adultFoodChoice["price"] * getFoodAmount("adult", "min");
    const fyAdultMax = adultMonths * 30 * adultFoodChoice["price"] * getFoodAmount("adult", "max");

    const fyMin = fyPuppyMin + fyAdultMin;
    const fyMax = fyPuppyMax + fyAdultMax;
    fy = `${toPesoFormat(fyMin)} - ${toPesoFormat(fyMax)}`;
  }

  function calculateAfy(maturity) {
    // CALCULATE AFTER FIRST YEAR
    const dayMax = adultFoodChoice["price"] * getFoodAmount(maturity, "max");
    const dayMin = adultFoodChoice["price"] * getFoodAmount(maturity, "min");
    const monthMin = dayMin * 30;
    const monthMax = dayMax * 30;
    const yearMin = monthMin * 12;
    const yearMax = monthMax * 12;

    daily = `${toPesoFormat(dayMin)} - ${toPesoFormat(dayMax)}`;
    monthly = `${toPesoFormat(monthMin)} - ${toPesoFormat(monthMax)}`;
    yearly = `${toPesoFormat(yearMin)} - ${toPesoFormat(yearMax)}`;
  }

  function getFoodAmount(maturity, threshold) {
    const g = foodAmount[maturity][choiceDog["size"]][threshold];
    return g / 1000;
  }

  function toPesoFormat(number) {
    number = Math.trunc(number);
    number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `₱${number}`;
  }
}

function showSummary() {
  $("#secondDisplay h3 p").text(` ${choiceDog["maturity"]} ${choiceDog["breed"]} (${choiceDog["age"]} months old) `);
  if (choiceDog["maturity"] === "puppy") {
    // First Year Section
    $("#expenseSummary").append(`<h4>First Year:</h4>`);
    $("#expenseSummary").append(`<p>&#x2022; ${getDailyFood(choiceDog["size"], "puppy")}</p>`);
    $("#expenseSummary").append(`<p>&#x2022; Total: <span>${fy}</span></p>`);

    // Preceding Years Section
    $("#expenseSummary").append(`<br>`);
    $("#expenseSummary").append(`<h4>Preceding Years:</h4>`);
    $("#expenseSummary").append(`<p>&#x2022; ${getDailyFood(choiceDog["size"], "adult")}</p>`);
    $("#expenseSummary").append(`<p>&#x2022<span> ${daily}</span> per day</p>`);
    $("#expenseSummary").append(`<p>&#x2022<span> ${monthly}</span> per month</p>`);
    $("#expenseSummary").append(`<p>&#x2022<span> ${yearly}</span> per year</p>`);
  } else {
    // Adult or Senior Section
    $("#expenseSummary").append(`<h4>Daily, Monthly, Yearly:</h4>`);
    $("#expenseSummary").append(`<p>&#x2022; ${getDailyFood(choiceDog["size"], choiceDog["maturity"])}</p>`);
    $("#expenseSummary").append(`<p>&#x2022<span> ${daily}</span> per day</p>`);
    $("#expenseSummary").append(`<p>&#x2022<span> ${monthly}</span> per month</p>`);
    $("#expenseSummary").append(`<p>&#x2022<span> ${yearly}</span> per year</p>`);
  }

  function getDailyFood(size, maturity) {
    const amount = `${foodAmount[maturity][size]["min"]}g-${foodAmount[maturity][size]["max"]}g`;
    const frequency = maturity === "puppy" ? "twice a day" : "thrice a day";
    return `Feed ${frequency}, total of ${amount}`;
  }
}

// BUTTON CLICK
$("#primaryBtn").click(function () {
  dogAge = $("#dogAge").val();

  if (activeDisplay === 1) {
    // FIRST DISPLAY
    // AGE VALIDATION
    if (dogAge == "" || dogAge <= 2 || dogAge >= 360) {
      $("#ageError").addClass("visible");
      $("#dogAge").addClass("error-input");
      return;
    } else {
      $("#ageError").removeClass("visible");
      $("#dogAge").removeClass("error-input");

      dogAge = parseInt(dogAge);
    }

    // COMPLETE DOG CHARACTERISTICS
    choiceDog = { ...choiceDog, maturity: maturity, age: dogAge, age: dogAge, adultAge: adultAge };

    puppyFoodChoice = $("#puppyFoods").val();
    adultFoodChoice = $("#adultFoods").val();
    let puppyCustomPrice = $("#puppyCustomPrice").val();
    let adultCustomPrice = $("#adultCustomPrice").val();

    if (choiceDog["maturity"] == "puppy") {
      if (puppyFoodChoice == "Custom price") {
        // MAKE CUSTOM PUPPY FOOD OBJECT
        puppyFoodChoice = { brand: "Custom", price: puppyCustomPrice, desc: "" };
      } else {
        // GET PUPPY FOOD OBJECT
        for (let puppyFood of foods["puppy"]) {
          if (puppyFoodChoice.includes(puppyFood["brand"])) {
            puppyFoodChoice = puppyFood;
            break; // Exit the loop when the condition is satisfied
          }
        }
      }
    }

    if (adultFoodChoice == "Custom price") {
      // MAKE CUSTOM adult FOOD OBJECT
      adultFoodChoice = { brand: "Custom", price: adultCustomPrice, desc: "" };
    } else {
      // GET ADULT FOOD OBJECT
      for (let adultFood of foods["adult"]) {
        if (adultFoodChoice.includes(adultFood["brand"])) {
          adultFoodChoice = adultFood;
          break; // Exit the loop when the condition is satisfied
        }
      }
    }

    $(this).val("CALCULATE AGAIN");
    calculate();
    showDisplay(2);
  } else if (activeDisplay == 2) {
    // SECOND DISPLAY
    $("#firstDisplay").trigger("reset");
    $(".custom-price").prop("disabled", true);
    $("#puppyFoodsWrapper .overlay").show().removeClass("half");
    $("#adultFoodsWrapper .overlay").show().removeClass("half");
    $("#expenseSummary").text("");

    $(this).val("CALCULATE");
    showDisplay(1);
  }
});

$("#firstDisplay").on("change", function () {
  // GET BREED
  breed = $("#dogBreeds").val();
  dogs.forEach((dog) => {
    if (breed == dog["breed"]) {
      choiceDog = dog;
    }
  });

  // GET AGE
  dogAge = $("#dogAge").val();

  // GET MATURITY
  if (dogAge < ages["adult"][size] && dogAge > 2) {
    maturity = "puppy";
  } else if (dogAge >= ages["adult"][size]) {
    maturity = "adult";
  } else if (dogAge >= ages["senior"][size]) {
    maturity = "senior";
  }

  // GET SIZE, ADULT AGE, MATURITY
  size = choiceDog["size"];
  adultAge = ages["adult"][size];

  // DOG FOOD SELECTION DISABLING
  if (maturity == "puppy") {
    $("#puppyFoodsWrapper .overlay").show().addClass("half");
    $("#adultFoodsWrapper .overlay").show().addClass("half");
  } else if (maturity == "adult" || maturity == "senior") {
    $("#puppyFoodsWrapper .overlay").show().removeClass("half");
    $("#adultFoodsWrapper .overlay").show().addClass("half");
  } else {
    $("#puppyFoodsWrapper .overlay").show().removeClass("half");
    $("#adultFoodsWrapper .overlay").show().removeClass("half");
  }

  // CUSTOM OVERLAY
  $(".select").each(function () {
    if ($(this).val() == "Custom price") {
      $(this).parent().siblings(".custom-price").prop("disabled", false);
      $(this).parent().siblings(".overlay").hide().removeClass("half");
    } else if (maturity != "undefined") {
      $(this).parent().siblings(".custom-price").prop("disabled", true);
      // $(this).siblings(".overlay").show().addClass("half");
    }
  });

  // AGE VALIDATION
  if (dogAge < 360 && dogAge > 2) {
    $("#dogAge").removeClass("error-input");
    $("#ageError").removeClass("visible");
  } else {
    $("#puppyFoodsWrapper .overlay").show().removeClass("half");
    $("#adultFoodsWrapper .overlay").show().removeClass("half");
  }
});
