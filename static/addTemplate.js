let avgr;
let avgr24;
let avgr48;
let avgr72;
let avgr96;
let avgr120;
let avgr144;
let avgr168;
menuActivated = false;

async function fillValues() {
    let response = await fetch(`/getdata/6`);
    weatherData = await response.json();
}

async function getAvgData(hour) {
    let avgResponse = await fetch(`/avg/${hour}`);
    avgData = await avgResponse.json();
    for (const key of Object.keys(avgData)) {
        avgData[key] = avgData[key].toFixed(2);
    }
    return avgData;
}

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

async function showDataT() {
    temperature = `
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
            <td>${weatherData['curr-5h']['TemperatureC']}</td>
            <td>${weatherData['curr-4h']['TemperatureC']}</td>
            <td>${weatherData['curr-3h']['TemperatureC']}</td>
            <td>${weatherData['curr-2h']['TemperatureC']}</td>
            <td>${weatherData['curr-1h']['TemperatureC']}</td>
            <td>${weatherData['curr-0h']['TemperatureC']}</td>
            <td>${avgr['TemperatureC']}</td>
        </tr>
    </table>
    <table>
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
    if (!menuActivated) {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.classList.add("data-sheet-activated");
            el.innerHTML = temperature;
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.classList.remove('data-sheet-acitvated')
        }
        menuActivated = false;
    }
}
async function showDataUV() {
    UvIndex = `
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
    <table>
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
            <th>${avgr24}['UV']</th>
            <th>${avgr48}['UV']</th>
            <th>${avgr72}['UV']</th>
            <th>${avgr96}['UV']</th>
            <th>${avgr120}['TemperatureC']</th>
            <th>${avgr144}['TemperatureC']</th>
            <th>${avgr168}['TemperatureC']</th>
        </tr>
    </table>`
    if (!menuActivated) {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.classList.add("data-sheet-activated");
            el.innerHTML = UvIndex;
        }
        menuActivated = true;
    } else {
        for (const el of document.querySelectorAll('.data-sheet-wrapper')) {
            el.classList.remove('data-sheet-acitvated')
        }
        menuActivated = false;
    }
}