# The main function of this file will be the data display as Webserver
# It is supposed to split the processing into Setup&Collection - Storign - "Display"

# Import lib
from logging import debug ### DISABLE DEBUG LATER
from flask import Flask, render_template
import datetime # To access datetime.timedelta(Time shift))
import measureData # Just for importing $nonISOtime
import insertData # 'Display' depends on 'Collection'

app = Flask(__name__)

# Prevent error on table creation by trying to create table
try:
    insertData.createDB()
except:
    print("Table creation failed, already existing")

# Functions used directly on the website
def dataListByShiftTime(shift_val):
    '''Get DB entries by $currtime + $shift_val'''
    ShiftedTime = measureData.nonISOtime + datetime.timedelta(hours=shift_val)
    ISOformatTime = ShiftedTime.isoformat()
    
    return insertData.getDataByVariable(ISOformatTime)

# Accessible URL's

@app.route('/')
def index():
    '''Root site, index.html will be presented'''
    return render_template('index.html') # Flask will look for html in /templates

@app.route('/getdata')
def getdata():
    '''Store data from past 5h in nested Dict on /getdata'''
    PastTimeDataDict = {
            'curr-0h': dataListByShiftTime(0),
            'curr-1h': dataListByShiftTime(-1),
            'curr-2h': dataListByShiftTime(-2),
            'curr-3h': dataListByShiftTime(-3),
            'curr-4h': dataListByShiftTime(-4),
            'curr-5h': dataListByShiftTime(-5),
            }
    # Syntax for fetching out of nested dict
    # $ print(PastTimeDataDict['curr-0h']['TemperatureC']
    return PastTimeDataDict

# Prevent execution on import & enable on Site Debug
if __name__ == '__main__':
    app.run(debug=True)
