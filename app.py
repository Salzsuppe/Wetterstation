# The main function of this file will be the data display as Webserver
# It is supposed to split the processing into Setup - Collection - Storing - Extraction - "Display"

# This is the webserver, execute to activate

# Import lib
from flask import Flask, render_template
import datetime # To access datetime.timedelta(Time shift))
import insertData # Import table creation
import extractData # Import sql extract functions

app = Flask(__name__)

# Prevent error on nonexistend table, by creating table
insertData.createDB()

# Functions used directly on the website
def dataListByShiftTime(shift_val):
    '''Get DB entries by $currtime + $shift_val'''
    PastTimeDataDict = {}
    for hour in range(shift_val):
        nonISOtime = datetime.datetime.now().replace(microsecond=0, second=0, minute=0)

        ShiftedTime = nonISOtime + datetime.timedelta(hours=(hour*-1))
        ISOformatTime = ShiftedTime.isoformat()
        data = extractData.getDataByVariable(ISOformatTime)
        if data: # It equals true if the dictionary has elements
            PastTimeDataDict["curr-"+str(hour)+"h"] = extractData.getDataByVariable(ISOformatTime)
    return PastTimeDataDict


# Accessible URL's
@app.route('/')
def index():
    '''Root site, index.html will be presented'''
    return render_template('index.html') # Flask will look for index.html in /templates

@app.route('/getdata/<int:hours>')
def data(hours):
    '''Store data from past $hours in nested Dict on /getdata/'''
    return dataListByShiftTime(hours)

@app.route('/avg/<int:hours>')
def avg(hours):
    '''Store avg data from past $hours in nested Dict on /avg/'''
    return extractData.getAvg(dataListByShiftTime(hours))

# Prevent execution on import & enable on Site Debug
if __name__ == '__main__':
    app.run()