function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//creates new divs which are randomly shown on the screen
function makeRain() {
  var raindropWrapper = document.querySelector(".raindropWrapper");
  for (i = 0; i < 160; i++) {
    var raindrop =
      '<div class="raindrop" style="top:' + getRandomArbitrary(0, 99)+"%; left:" + getRandomArbitrary(0, 98) + '%;"><img src="static/Wetterdesign/Raindrop.svg"></div>';
    raindropWrapper.insertAdjacentHTML("beforeend", raindrop);
  }
}

//gets every .temp element and changes the text in it
function changeTemp(temp, unit) {
  for (const el of document.querySelectorAll(".temp")) {
    el.innerText = temp + "°" + unit;
  }
}

let avgData;

//gets the avg Ddata from the flask application in app.py
async function getAvgData(hour) {
  let avgResponse = await fetch(`/avg/${hour}`);
  avgData = await avgResponse.json();
  for (const key of Object.keys(avgData)) {
    avgData[key] = avgData[key].toFixed(2);
  }
  return avgData;
}

let weatherData;

//gets all the data from the flask application in app.py
async function fillValues() {
  let response = await fetch(`/getdata/6`);
  weatherData = await response.json();
  changeTemp(weatherData["curr-0h"]["TemperatureC"], "C");
}

//changing the temperature values on button click
function onClickCelsius() {
  changeTemp(weatherData["curr-0h"]["TemperatureC"], "C"); //getting variables from the dictionary
  showMenu();
}
function onClickFahrenheit() {
  changeTemp(weatherData["curr-0h"]["TemperatureF"], "F");
  showMenu();
}
function onClickKelvin() {
  changeTemp(weatherData["curr-0h"]["TemperatureK"], "K");
  showMenu();
}

let menuActivated = false;

//activates the menu for changing the temperature units
function showMenu() {
  if (!menuActivated) {
      for (const el of document.querySelectorAll(".menu-pulldown")) {
        el.classList.add("menu-pulldown-activated"); //changes the class name to show smth else wich is styled in css
      }
      menuActivated = true;
  } else {
    for (const el of document.querySelectorAll(".menu-pulldown")) {
      el.classList.remove("menu-pulldown-activated"); //changes the class name again to show what it was before
    }
    menuActivated = false;
  }
}

//adds an onclick event for the menu buttons
for (const el of document.querySelectorAll(".menu-button")) {
  //select every element which is named menu-button
  el.addEventListener("click", () => {
    showMenu();
  }); //when the button is clicked call the function showMenu
}

//calculate felt temperature
function getFeelingTemp() {
  var t = weatherData["curr-0h"]["TemperatureC"];
  var wind = weatherData["curr-0h"]["Wind"];

  vSix = Math.pow(wind, 0.16); //function for calculating with exponents

  var feeling = 13.12 + 0.6215 * t - 11.37 * vSix + 0.3965 * t * vSix; //formular to calculate the felt temprature
  var roundFeeling = feeling.toFixed(2); //round the answer to two digits

  changeTemp(roundFeeling, "C");
  showMenu();
}

//function to change the weather screen when the the weather is different
async function weatherScreen() {
  sun = document.querySelector(".sunny"); //select the different screens
  rain = document.querySelector(".rainy");
  cloud = document.querySelector(".cloudy");

  //changes the visiglity of the classes
  if (weatherData['curr-0h']['Rain'] == 1) {
    sun.style.display = 'none'
    rain.style.display = 'flex'
    cloud.style.display = 'none'
  }
  else if (weatherData['curr-0h']['Humidity'] >= 60 && weatherData['curr-0h']['UV'] < 1) {
    sun.style.display = 'none'
    rain.style.display = 'none'
    cloud.style.display = 'flex'
  }
  else if (weatherData['curr-0h']['UV'] >= 1) {
    sun.style.display = 'flex'
    rain.style.display = 'none'
    cloud.style.display = 'none'
  }
}
makeRain();
