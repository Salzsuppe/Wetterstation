let avgr;
let avgr24;
let avgr48;
let avgr72;
let avgr96;
let avgr120;
let avgr144;
let avgr168;
let avgData;
menuActivated = false;

//fetches the data from the avgData flask application
async function getAvgData(hour) {
    let avgResponse = await fetch(`/avg/${hour}`);
    avgData = await avgResponse.json(); //makes a json object to access the data
    for (const key of Object.keys(avgData)) {
        avgData[key] = avgData[key].toFixed(2); //rounds the data on 2 decimal places
    }
    return avgData;
}

//declare the avgData variables so they can be accessed from every function
async function declareData() {
    avgr = await getAvgData(5);
    avgr24 = await getAvgData(24);
    avgr48 = await getAvgData(48);
    avgr72 = await getAvgData(72);
    avgr96 = await getAvgData(96);
    avgr120 = await getAvgData(120);
    avgr144 = await getAvgData(144);
    avgr168 = await getAvgData(168);
}

declareData().then(() => {
    //adds an onclick event for the menu buttons
    document.querySelector("#data-button-T").addEventListener('click', showDataT)
    document.querySelector("#data-button-UV").addEventListener('click', showDataUV)
    document.querySelector("#data-button-LF").addEventListener('click', showDataLF)
    document.querySelector("#data-button-LD").addEventListener('click', showDataLD)
    document.querySelector("#data-button-L").addEventListener('click', showDataL)
    document.querySelector("#data-button-WS").addEventListener('click', showDataWS)
})
//creates a template which will be added to the HTML when a button is pressed
async function showDataT() {
    //template
    temperature = `
    <div class="header">
        <p>Temperatur</p>
    </div>
    <table>
        <tr>
            <th>-5h</th>
            <th>-4h</th>
            <th>-3h</th>
            <th>-2h</th>
            <th>-1h</th>
            <th>Gerade</th>
            <th>Avg</th>
        <tr>
        <tr>
            <td>${weatherData['curr-5h']['TemperatureC'].toFixed(2)}°C</td>
            <td>${weatherData['curr-4h']['TemperatureC'].toFixed(2)}°C</td>
            <td>${weatherData['curr-3h']['TemperatureC'].toFixed(2)}°C</td>
            <td>${weatherData['curr-2h']['TemperatureC'].toFixed(2)}°C</td>
            <td>${weatherData['curr-1h']['TemperatureC'].toFixed(2)}°C</td>
            <td>${weatherData['curr-0h']['TemperatureC'].toFixed(2)}°C</td>
            <td>${avgr['TemperatureC']}</td>
        </tr>
    </table>
    <table class="avg-table">
        <tr>
            <th>Gestern</th>
            <th>Vorgestern</th>
            <th>Vor 3 Tagen</th>
            <th>Vor 4 Tagen</th>
            <th>Vor 5 Tagen</th>
            <th>Vor 6 Tagen</th>
            <th>Vor 7 Tagen</th>
        </tr>
        <tr>
            <th>${avgr24['TemperatureC']}°C</th>
            <th>${avgr48['TemperatureC']}°C</th>
            <th>${avgr72['TemperatureC']}°C</th>
            <th>${avgr96['TemperatureC']}°C</th>
            <th>${avgr120['TemperatureC']}°C</th>
            <th>${avgr144['TemperatureC']}°C</th>
            <th>${avgr168['TemperatureC']}°C</th>
        </tr>
    </table>`
    //shows the data table when the button is pressed
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".data-sheet-wrapper")) {
            el.innerHTML = temperature;
            el.classList.add('data-sheet-activated')//adds a class name so the style attributs change
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.innerHTML = null;
            el.classList.remove('data-sheet-acitvated')//removes the class name when the button is pressed again
        }
        menuActivated = false;
    }
}
async function showDataUV() {
    uvIndex = `
    <div class="header">
        <p>UV-Index</p>
    </div>
    <table>
        <tr>
            <th>-5h</th>
            <th>-4h</th>
            <th>-3h</th>
            <th>-2h</th>
            <th>-1h</th>
            <th>Gerade</th>
            <th>Avg</th>
        <tr>
        <tr>
            <td>${weatherData['curr-5h']['UV']}</td>
            <td>${weatherData['curr-4h']['UV']}</td>
            <td>${weatherData['curr-3h']['UV']}</td>
            <td>${weatherData['curr-2h']['UV']}</td>
            <td>${weatherData['curr-1h']['UV']}</td>
            <td>${weatherData['curr-0h']['UV']}</td>
            <td>${avgr['UV']}</td>
        </tr>
    </table>
    <table class="avg-table">
        <tr>
            <th>Gestern</th>
            <th>Vorgestern</th>
            <th>Vor 3 Tagen</th>
            <th>Vor 4 Tagen</th>
            <th>Vor 5 Tagen</th>
            <th>Vor 6 Tagen</th>
            <th>Vor 7 Tagen</th>
        </tr>
        <tr>
            <th>${avgr24['UV']}</th>
            <th>${avgr48['UV']}</th>
            <th>${avgr72['UV']}</th>
            <th>${avgr96['UV']}</th>
            <th>${avgr120['UV']}</th>
            <th>${avgr144['UV']}</th>
            <th>${avgr168['UV']}</th>
        </tr>
    </table>`
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".data-sheet-wrapper")) {
            el.innerHTML = uvIndex;
            el.classList.add('data-sheet-activated')
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.innerHTML = null;
            el.classList.remove('data-sheet-acitvated')
        }
        menuActivated = false;
    }
}
async function showDataLF() {
    humidity = `
    <div class="header">
        <p>Luftfeuchtigkeit</p>
    </div>
    <table>
        <tr>
            <th>-5h</th>
            <th>-4h</th>
            <th>-3h</th>
            <th>-2h</th>
            <th>-1h</th>
            <th>Gerade</th>
            <th>Avg</th>
        <tr>
        <tr>
            <td>${weatherData['curr-5h']['Humidity']}%</td>
            <td>${weatherData['curr-4h']['Humidity']}%</td>
            <td>${weatherData['curr-3h']['Humidity']}%</td>
            <td>${weatherData['curr-2h']['Humidity']}%</td>
            <td>${weatherData['curr-1h']['Humidity']}%</td>
            <td>${weatherData['curr-0h']['Humidity']}%</td>
            <td>${avgr['Humidity']}</td>
        </tr>
    </table>
    <table class="avg-table">
        <tr>
            <th>Gestern</th>
            <th>Vorgestern</th>
            <th>Vor 3 Tagen</th>
            <th>Vor 4 Tagen</th>
            <th>Vor 5 Tagen</th>
            <th>Vor 6 Tagen</th>
            <th>Vor 7 Tagen</th>
        </tr>
        <tr>
            <th>${avgr24['Humidity']}%</th>
            <th>${avgr48['Humidity']}%</th>
            <th>${avgr72['Humidity']}%</th>
            <th>${avgr96['Humidity']}%</th>
            <th>${avgr120['Humidity']}%</th>
            <th>${avgr144['Humidity']}%</th>
            <th>${avgr168['Humidity']}%</th>
        </tr>
    </table>`
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".data-sheet-wrapper")) {
            el.innerHTML = humidity;
            el.classList.add('data-sheet-activated')
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.innerHTML = null;
            el.classList.remove('data-sheet-acitvated')
        }
        menuActivated = false;
    }
}
async function showDataLD() {
    pressure = `
    <div class="header">
        <p>Luftdruck</p>
    </div>
    <table>
        <tr>
            <th>-5h</th>
            <th>-4h</th>
            <th>-3h</th>
            <th>-2h</th>
            <th>-1h</th>
            <th>Gerade</th>
            <th>Avg</th>
        <tr>
        <tr>
            <td>${weatherData['curr-5h']['Pressure']} Bar</td>
            <td>${weatherData['curr-4h']['Pressure']} Bar</td>
            <td>${weatherData['curr-3h']['Pressure']} Bar</td>
            <td>${weatherData['curr-2h']['Pressure']} Bar</td>
            <td>${weatherData['curr-1h']['Pressure']} Bar</td>
            <td>${weatherData['curr-0h']['Pressure']} Bar</td>
            <td>${avgr['Pressure']}</td>
        </tr>
    </table>
    <table class="avg-table">
        <tr>
            <th>Gestern</th>
            <th>Vorgestern</th>
            <th>Vor 3 Tagen</th>
            <th>Vor 4 Tagen</th>
            <th>Vor 5 Tagen</th>
            <th>Vor 6 Tagen</th>
            <th>Vor 7 Tagen</th>
        </tr>
        <tr>
            <th>${avgr24['Pressure']} Bar</th>
            <th>${avgr48['Pressure']} Bar</th>
            <th>${avgr72['Pressure']} Bar</th>
            <th>${avgr96['Pressure']} Bar</th>
            <th>${avgr120['Pressure']} Bar</th>
            <th>${avgr144['Pressure']} Bar</th>
            <th>${avgr168['Pressure']} Bar</th>
        </tr>
    </table>`
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".data-sheet-wrapper")) {
            el.innerHTML = pressure;
            el.classList.add('data-sheet-activated')
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.innerHTML = null;
            el.classList.remove('data-sheet-acitvated')
        }
        menuActivated = false;
    }
}
async function showDataWS() {
    wind = `
    <div class="header">
        <p>Windstärke</p>
    </div>
    <table>
        <tr>
            <th>-5h</th>
            <th>-4h</th>
            <th>-3h</th>
            <th>-2h</th>
            <th>-1h</th>
            <th>Gerade</th>
            <th>Avg</th>
        <tr>
        <tr>
            <td>${weatherData['curr-5h']['Wind']} km/h</td>
            <td>${weatherData['curr-4h']['Wind']} km/h</td>
            <td>${weatherData['curr-3h']['Wind']} km/h</td>
            <td>${weatherData['curr-2h']['Wind']} km/h</td>
            <td>${weatherData['curr-1h']['Wind']} km/h</td>
            <td>${weatherData['curr-0h']['Wind']} km/h</td>
            <td>${avgr['Wind']}</td>
        </tr>
    </table>
    <table class="avg-table">
        <tr>
            <th>Gestern</th>
            <th>Vorgestern</th>
            <th>Vor 3 Tagen</th>
            <th>Vor 4 Tagen</th>
            <th>Vor 5 Tagen</th>
            <th>Vor 6 Tagen</th>
            <th>Vor 7 Tagen</th>
        </tr>
        <tr>
            <th>${avgr24['Wind']}km/h</th>
            <th>${avgr48['Wind']}km/h</th>
            <th>${avgr72['Wind']}km/h</th>
            <th>${avgr96['Wind']}km/h</th>
            <th>${avgr120['Wind']}km/h</th>
            <th>${avgr144['Wind']}km/h</th>
            <th>${avgr168['Wind']}km/h</th>
        </tr>
    </table>`
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".data-sheet-wrapper")) {
            el.innerHTML = wind;
            el.classList.add('data-sheet-activated')
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.innerHTML = null;
            el.classList.remove('data-sheet-acitvated')
        }
        menuActivated = false;
    }
}
async function showDataL() {
    light = `
    <div class="header">
        <p>Helligkeit</p>
    </div>
    <table>
        <tr>
            <th>-5h</th>
            <th>-4h</th>
            <th>-3h</th>
            <th>-2h</th>
            <th>-1h</th>
            <th>Gerade</th>
            <th>Avg</th>
        <tr>
        <tr>
            <td>${weatherData['curr-5h']['Light']} Lux</td>
            <td>${weatherData['curr-4h']['Light']} Lux</td>
            <td>${weatherData['curr-3h']['Light']} Lux</td>
            <td>${weatherData['curr-2h']['Light']} Lux</td>
            <td>${weatherData['curr-1h']['Light']} Lux</td>
            <td>${weatherData['curr-0h']['Light']} Lux</td>
            <td>${avgr['Light']}</td>
        </tr>
    </table>
    <table class="avg-table">
        <tr>
            <th>Gestern</th>
            <th>Vorgestern</th>
            <th>Vor 3 Tagen</th>
            <th>Vor 4 Tagen</th>
            <th>Vor 5 Tagen</th>
            <th>Vor 6 Tagen</th>
            <th>Vor 7 Tagen</th>
        </tr>
        <tr>
            <th>${avgr24['Light']} Lux</th>
            <th>${avgr48['Light']} Lux</th>
            <th>${avgr72['Light']} Lux</th>
            <th>${avgr96['Light']} Lux</th>
            <th>${avgr120['Light']} Lux</th>
            <th>${avgr144['Light']} Lux</th>
            <th>${avgr168['Light']} Lux</th>
        </tr>
    </table>`
    if (!menuActivated) {
        for (const el of document.querySelectorAll(".data-sheet-wrapper")) {
            el.innerHTML = light;
            el.classList.add('data-sheet-activated')
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.innerHTML = null;
            el.classList.remove('data-sheet-acitvated')
        }
        menuActivated = false;
    }
}