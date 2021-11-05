import getData
from logging import debug
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/getdata')
def getdata():
    datadict = {
        "tmpC": getData.TemperatureC_val,
        "tmpF": getData.TemperatureF_val,
        "tmpK": getData.TemperatureK_val
    }


if __name__ == '__main__':
    app.run(debug=True)