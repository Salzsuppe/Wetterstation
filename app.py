import test
from logging import debug
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', tempC=test.TemperatureC_val, tempK=test.TemperatureK_val, tempF=test.TemperatureF_val)


if __name__ == '__main__':
    app.run(debug=True)