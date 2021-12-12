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

//creates a tabel with values which will be updated every hour
async function update() {
  //set variables for passed time
  avgr = await getAvgData(5);
  avgr24 = await getAvgData(24);
  avgr48 = await getAvgData(48);
  avgr72 = await getAvgData(72);
  avgr96 = await getAvgData(96);
  avgr120 = await getAvgData(120);
  avgr144 = await getAvgData(144);
  avgr168 = await getAvgData(168);

  //creates the table
  //when we dont get any values, it shows undefinded
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
        <td>${weatherData["curr-5h"]["UV"]}</td>
        <td>${weatherData["curr-4h"]["UV"]}</td>
        <td>${weatherData["curr-3h"]["UV"]}</td>
        <td>${weatherData["curr-2h"]["UV"]}</td>
        <td>${weatherData["curr-1h"]["UV"]}</td>
        <td>${weatherData["curr-0h"]["UV"]}</td>
        <td>${avgr["UV"]}</td>
      </tr>
      <tr>
      <td>Luftdruck</td>
        <td>${weatherData["curr-5h"]["Pressure"]} Bar</td>
        <td>${weatherData["curr-4h"]["Pressure"]} Bar</td>
        <td>${weatherData["curr-3h"]["Pressure"]} Bar</td>
        <td>${weatherData["curr-2h"]["Pressure"]} Bar</td>
        <td>${weatherData["curr-1h"]["Pressure"]} Bar</td>
        <td>${weatherData["curr-0h"]["Pressure"]} Bar</td>
        <td>${avgr["Pressure"]}</td>
      </tr>
      <tr>
      <td>Luftfeuchtigkeit</td>
        <td>${weatherData["curr-5h"]["Humidity"]} %</td>
        <td>${weatherData["curr-4h"]["Humidity"]} %</td>
        <td>${weatherData["curr-3h"]["Humidity"]} %</td>
        <td>${weatherData["curr-2h"]["Humidity"]} %</td>
        <td>${weatherData["curr-1h"]["Humidity"]} %</td>
        <td>${weatherData["curr-0h"]["Humidity"]} %</td>
        <td>${avgr["Humidity"]}</td>
      </tr>
      <tr>
      <td>Windstärke</td>
        <td>${weatherData["curr-5h"]["Wind"]} km/h</td>
        <td>${weatherData["curr-4h"]["Wind"]} km/h</td>
        <td>${weatherData["curr-3h"]["Wind"]} km/h</td>
        <td>${weatherData["curr-2h"]["Wind"]} km/h</td>
        <td>${weatherData["curr-1h"]["Wind"]} km/h</td>
        <td>${weatherData["curr-0h"]["Wind"]} km/h</td>
        <td>${avgr["Wind"]}</td>
      </tr>
      <td>Helligkeit</td>
      <td>${weatherData["curr-5h"]["Light"]} Lux</td>
      <td>${weatherData["curr-4h"]["Light"]} Lux</td>
      <td>${weatherData["curr-3h"]["Light"]} Lux</td>
      <td>${weatherData["curr-2h"]["Light"]} Lux</td>
      <td>${weatherData["curr-1h"]["Light"]} Lux</td>
      <td>${weatherData["curr-0h"]["Light"]} Lux</td>
      <td>${avgr["Light"]}</td>
    </tr>
    </table>
    <table>
        <tr>
          <th></th>
          <th>Gestern</th>
          <th>Vorgestern</th>
          <th>Vor 3 Tagen</th> 
          <th>Vor 4 Tagen</th>
          <th>Vor 5 Tagen</th>
          <th>Vor 6 Tagen</th>
          <th>Vor 7 Tagen</th>
        </tr>
        <tr>
          <td>Temperature</td>
          <td>${avgr24["TemperatureC"]} °C</td>
          <td>${avgr48["TemperatureC"]} °C</td>
          <td>${avgr72["TemperatureC"]} °C</td>
          <td>${avgr96["TemperatureC"]} °C</td>
          <td>${avgr120["TemperatureC"]} °C</td>
          <td>${avgr144["TemperatureC"]} °C</td>
          <td>${avgr168["TemperatureC"]} °C</td>
        </tr>
        <tr>
          <td>UV-Index</td>
          <td>${avgr24["UV"]} </td>
          <td>${avgr48["UV"]} </td>
          <td>${avgr72["UV"]} </td>
          <td>${avgr96["UV"]} </td>
          <td>${avgr120["UV"]} </td>
          <td>${avgr144["UV"]} </td>
          <td>${avgr168["UV"]} </td>
        </tr>
        <tr>
        <td>Luftdruck</td>
          <td>${avgr24["Pressure"]} Bar</td>
          <td>${avgr48["Pressure"]} Bar</td>
          <td>${avgr72["Pressure"]} Bar</td>
          <td>${avgr96["Pressure"]} Bar</td>
          <td>${avgr120["Pressure"]} Bar</td>
          <td>${avgr144["Pressure"]} Bar</td>
          <td>${avgr168["Pressure"]} Bar</td>
        </tr>
        <tr>
        <td>Luftfeuchtigkeit</td>
          <td>${avgr24["Humidity"]} %</td>
          <td>${avgr48["Humidity"]} %</td>
          <td>${avgr72["Humidity"]} %</td>
          <td>${avgr96["Humidity"]} %</td>
          <td>${avgr120["Humidity"]} %</td>
          <td>${avgr144["Humidity"]} %</td>
          <td>${avgr168["Humidity"]} %</td>
        </tr>
        <tr>
        <td>Windstärke</td>
          <td>${avgr24["Wind"]} km/h</td>
          <td>${avgr48["Wind"]} km/h</td>
          <td>${avgr72["Wind"]} km/h</td>
          <td>${avgr96["Wind"]} km/h</td>
          <td>${avgr120["Wind"]} km/h</td>
          <td>${avgr144["Wind"]} km/h</td>
          <td>${avgr168["Wind"]} km/h</td>
        </tr>
      </table>
    </div>`;

  document.getElementById("table-wrapper").innerHTML = template;
}
fillValues().then(update);
setInterval(update, 60 * 60 * 1000); //the table will be updated every hour
makeRain();
