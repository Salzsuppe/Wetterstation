function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function makeRain(){
    //creates new divs which are randomly shown on the screen
    var raindropWrapper = document.querySelector(".raindropWrapper")
    for (i = 0; i<160; i++){
        var raindrop = '<div class="raindrop" style="top:'+getRandomArbitrary(0, 99)+'%; left:'+getRandomArbitrary(0, 100)+'%;"></div>'
        raindropWrapper.insertAdjacentHTML('beforeend', raindrop)
    }
}

function changeTemp(temp, unit) {
    //gets every .temp element and changes the text in it
    for (const el of document.querySelectorAll(".temp")) {
        el.innerText = temp + "°" + unit
    }
}

let menuActivated = false;

function showMenu() {
    //activates the menu for changing the temperature units
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".menu-pulldown")) {
            el.classList.add("menu-pulldown-activated")
        }
        menuActivated = true;
    }
    else {
        for (const el of document.querySelectorAll(".menu-pulldown")) {
            el.classList.remove("menu-pulldown-activated")
        }
        menuActivated = false;
    }
}

let weatherData = null;

async function fillValues(){
    //gets all the data from the flask application in app.py
    let response = await fetch("/getdata");
    weatherData = await response.json();
    changeTemp(weatherData['curr-0h']['TemperatureC'], "C")
}

//changing the temperature values on button click
function onClickCelsius() {
    changeTemp(weatherData['curr-0h']['TemperatureC'], "C")
    showMenu()
}

function onClickFahrenheit() {
    changeTemp(weatherData['curr-0h']['TemperatureF'], "F")
    showMenu()
}

function onClickKelvin() {
    changeTemp(weatherData['curr-0h']['TemperatureK'], "K")
    showMenu()
}

function changeSun(){
    document.querySelector(".sunny").style.display = "flex"
    document.querySelector(".cloudy").style.display = "none"
    document.querySelector(".rainy").style.display = "none"
}
function changeCloud(){
    document.querySelector(".cloudy").style.display = "flex"
    document.querySelector(".sunny").style.display = "none"
    document.querySelector(".rainy").style.display = "none"
}
function changeRain(){
    document.querySelector(".rainy").style.display = "flex"
    document.querySelector(".sunny").style.display = "none"
    document.querySelector(".cloudy").style.display = "none"
}

//adds an onclick event for the menu buttons
for (const el of document.querySelectorAll(".menu-button")) {
    el.addEventListener("click", ()=>{showMenu()});
}

fillValues()
makeRain()
