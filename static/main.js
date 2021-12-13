let menuActivated = false;
let weatherData;

//gets all the data from the flask application in app.py
async function fillValues() {
  let response = await fetch(`/getdata/6`);
  weatherData = await response.json();
  changeTemp(weatherData["curr-0h"]["TemperatureC"], "C");
}

//function to change the weather screen on load, when the the weather is different
window.onload = async function weatherScreen() {
  sun = document.querySelector(".sunny"); //select the different screens
  rain = document.querySelector(".rainy");
  cloud = document.querySelector(".cloudy");

  //changes the visiblity of the classes
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

async function warningSigns() {
  ice = `<div class"ice"></div>`
  uv = `<div class="uv"></div>`
  wind = `<div class="wind"></div>`
  nebel = `<div class="nebel"</div>`
  el = document.querySelector('.warning-signs')
    var somethingTrue = false;
    el.innerHTML = null;
    if (weatherData['curr-0h']['TemperatureC'] <= 0 && weatherData['curr-0h']['Rain'] == 1) {
      el.innerHTML += ice;
      somethingTrue = true;
      el.classList.add('ice')
    } else {
      el.classList.remove('ice')
    }
    if (weatherData['curr-0h']['UV'] >= 6) {
      el.innerHTML += uv;
      somethingTrue = true;
      el.classList.add('uv')
    } else {
      el.classList.remove('uv')
    }
    if (weatherData['curr-0h']['Wind'] > 120) {
      el.innerHTML += wind;
      somethingTrue = true;
      el.classList.add('wind')
    } else {
      el.classList.remove('wind')
    }
    if (weatherData['curr-0h']['Humidity'] >= 90 && weatherData['curr-0h']['UV'] < 2) {
      el.innerHTML += nebel;
      somethingTrue = true;
      el.classList.add('nebel')
    } else {
      el.classList.remove('nebel')
    }
    if (somethingTrue == false) {
      el.innerHTML = null;
    }
}
fillValues().then(warningSigns)
setInterval(warningSigns, 60 * 60 * 1000); //the table will be updated every hour

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
makeRain();

//gets every .temp element and changes the text in it
function changeTemp(temp, unit) {
  for (const el of document.querySelectorAll(".temp")) {
    el.innerText = temp + "°" + unit;
  }
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

//activates the menu for changing the temperature units
function showMenu() {
  if (!menuActivated) {
      for (const el of document.querySelectorAll(".menu-pulldown")) {
        el.classList.add("menu-pulldown-activated"); //adds a class name so the style attributs change
      }
      menuActivated = true;
  } else {
    for (const el of document.querySelectorAll(".menu-pulldown")) {
      el.classList.remove("menu-pulldown-activated"); //removes the class name when the button is pressed again
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