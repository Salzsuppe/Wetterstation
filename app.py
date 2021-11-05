# import getData
from logging import debug
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/getdata')
def getdata():
    datadict = {
        "tmpC": 10,
        "tmpF": 2,
        "tmpK": 3
        ""
    }
    return datadict

if __name__ == '__main__':
    app.run(debug=True)