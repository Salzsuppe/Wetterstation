function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function makeRain(){
    //creates new divs which are randomly shown on the screen
    var raindropWrapper = document.querySelector(".raindropWrapper")
    for (i = 0; i<160; i++){
        var raindrop = '<div class="raindrop" style="top:'+getRandomArbitrary(0, 99)+'%; left:'+getRandomArbitrary(0, 99)+'%;"></div>'
        raindropWrapper.insertAdjacentHTML('beforeend', raindrop)
    }
}

function changeTemp(temp, unit) {
    //gets every .temp element and changes the text in it
    for (const el of document.querySelectorAll(".temp")) {
        el.innerText = temp + "°" + unit
    }
}

let weatherData = null;

async function fillValues(){
    //gets all the data from the flask application in app.py
    let response = await fetch("/getdata");
    weatherData.toFixed(2) = await response.json();
    changeTemp(weatherData['curr-0h']['TemperatureC'], "C")
}

//changing the temperature values on button click
function onClickCelsius() {
    changeTemp(weatherData['curr-0h']['TemperatureC'], "C") //getting variables from the dictionary
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

let menuActivated = false;

function showMenu() {
    //activates the menu for changing the temperature units
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".menu-pulldown")) {
            el.classList.add("menu-pulldown-activated") //changes the class name to show smth else wich is styled in css
        }
        menuActivated = true;
    }
    else {
        for (const el of document.querySelectorAll(".menu-pulldown")) {
            el.classList.remove("menu-pulldown-activated") //changes the class name again to show what it was before
        }
        menuActivated = false;
    }
}

//adds an onclick event for the menu buttons
for (const el of document.querySelectorAll(".menu-button")) {
    el.addEventListener("click", ()=>{showMenu()});
}

//calculate felt temperature
function getFeelingTemp() {
    var t = weatherData['curr-0h']['TemperatureC']
    var wind = weatherData['curr-0h']['Wind']

    vSix = Math.pow(wind, 0.16) //function for calculating with exponents

    var feeling = 13.12 + 0.6215*t - 11.37*vSix + 0.3965*t*vSix
    var roundFeeling = feeling.toFixed(2)


    changeTemp(roundFeeling)
    showMenu()
}


fillValues()
makeRain()
