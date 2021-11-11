function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function makeRain(){
    var raindropWrapper = document.querySelector(".raindropWrapper")
    for (i = 0; i<160; i++){
        var raindrop = '<div class="raindrop" style="top:'+getRandomArbitrary(0, 100)+'%; left:'+getRandomArbitrary(0, 100)+'%;"></div>'
        raindropWrapper.insertAdjacentHTML('beforeend', raindrop)
    }
}

function changeTemp(temp, unit) {
    for (const el of document.querySelectorAll(".temp")) {
        el.innerText = temp + "°" + unit
    }
}

let weatherData = null;

async function fillValues(){
    let response = await fetch("/getdata");
    weatherData = await response.json();
    changeTemp(weatherData.tmpC, "C")
}

function onClickCelsius() {
    changeTemp(weatherData.tmpC, "C")
}

function onClickFahrenheit() {
    changeTemp(weatherData.tmpF, "F")
}

function onClickKelvin() {
    changeTemp(weatherData.tmpK, "K")
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

fillValues()
makeRain()
