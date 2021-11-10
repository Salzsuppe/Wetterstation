# import getData
from logging import debug
from flask import Flask, render_template
import getData
import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/getdata')
def getdata():
    getDataByVariable(time)
    datadict = {
        "tmpC": getData.Temp,
        "tmpF": 2,
        "tmpK": 3,
        "humidity": 15,
        "pressure": 123,
        "rain": 1,
        "wind": 5,
        "uv": 2
    }
    return datadict

if __name__ == '__main__':
    app.run(debug=True)
