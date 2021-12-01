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

let weatherData;

async function fillValues(){
    //gets all the data from the flask application in app.py
    let response = await fetch("/getdata");
    weatherData = await response.json();
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
    //activates the menu for changing the temperature unitssdjklfdj
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

    var feeling = 13.12 + 0.6215*t - 11.37*vSix + 0.3965*t*vSix //formular to calculate the felt temprature
    var roundFeeling = feeling.toFixed(2) //round the answer to two digits

    changeTemp(roundFeeling, "C")
    showMenu()
}
makeRain()

function update(){
    let template = `
    <div class="table-wrapper">
    <table>
      <tr>
        <th></th>
        <th>-5h</th>
        <th>-4h</th>
        <th>-3h</th>
        <th>-2h</th>
        <th>-1h</th>
        <th>Gerade</th>
        <th>Avg.D</th>
      </tr>
      <tr>
        <td>UV-Index</td>
        <td>${weatherData['curr-5h']['UV']}</td>
        <td>${weatherData['curr-4h']['UV']}</td>
        <td>${weatherData['curr-3h']['UV']}</td>
        <td>${weatherData['curr-2h']['UV']}</td>
        <td>${weatherData['curr-1h']['UV']}</td>
        <td>${weatherData['curr-0h']['UV']}</td>
        <td></td>
      </tr>
      <tr>
      <td>Luftdruck</td>
       <td>${weatherData['curr-5h']['Pressure']}</td>
        <td>${weatherData['curr-4h']['Pressure']}</td>
        <td>${weatherData['curr-3h']['Pressure']}</td>
        <td>${weatherData['curr-2h']['Pressure']}</td>
        <td>${weatherData['curr-1h']['Pressure']}</td>
        <td>${weatherData['curr-0h']['Pressure']}</td>
        <td></td>
      </tr>
      <tr>
      <td>Luftfeuchtigkeit</td>
        <td>${weatherData['curr-5h']['Humidity']}</td>
        <td>${weatherData['curr-4h']['Humidity']}</td>
        <td>${weatherData['curr-3h']['Humidity']}</td>
        <td>${weatherData['curr-2h']['Humidity']}</td>
        <td>${weatherData['curr-1h']['Humidity']}</td>
        <td>${weatherData['curr-0h']['Humidity']}</td>
        <td></td>
      </tr>
      <tr>
      <td>Windstärke</td>
        <td>${weatherData['curr-5h']['Wind']}</td>
        <td>${weatherData['curr-4h']['Wind']}</td>
        <td>${weatherData['curr-3h']['Wind']}</td>
        <td>${weatherData['curr-2h']['Wind']}</td>
        <td>${weatherData['curr-1h']['Wind']}</td>
        <td>${weatherData['curr-0h']['Wind']}</td>
        <td></td>
      </tr>
    </table>
    <table>
        <tr>
          <th></th>
          <th>Mo</th>
          <th>Di</th>
          <th>Mi</th>
          <th>Do</th>
          <th>Fr</th>
          <th>Sa</th>
          <th>So</th>
          <th>Avg.W</th>
        </tr>
        <tr>
          <td>UV-Index</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
        <td>Luftdruck</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
        <td>Luftfeuchtigkeit</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
        <td>Windstärke</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>`

    document.getElementById("table-wrapper").innerHTML = template;
}
fillValues().then(update)
setInterval(update, 60 * 60 * 1000)