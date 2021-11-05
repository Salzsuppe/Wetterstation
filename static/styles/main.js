function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function a(){
    var raindropWrapper = document.querySelector(".raindropWrapper")
    for (i = 0; i<160; i++){
        var raindrop = '<div class="raindrop" style="top:'+getRandomArbitrary(0, 100)+'%; left:'+getRandomArbitrary(0, 100)+'%;"></div>'
        raindropWrapper.insertAdjacentHTML('beforeend', raindrop)
    }
}
a()

function tempC(){
    document.querySelector(".temp").innerHTML = TemperatureC_val
}
function tempF(){
    document.querySelector(".temp").innerHTML = TemperatureF_var
}
function tempK(){
    document.querySelector(".temp").innerHTML = TemperatureK_var
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