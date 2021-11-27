# The main function of this file will be the data display as Webserver
# It is supposed to split the processing into Setup&Collection - Storing - "Display"

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
    ShiftedTime = measureData.nonISOtime + datetime.timedelta(hours=(shift_val*-1))
    ISOformatTime = ShiftedTime.isoformat()
    
    return insertData.getDataByVariable(ISOformatTime)

def dataListByDate(Year,Month,Date):
    '''Get DB entries by $Date'''
    DataDict = {}
    for hour in range(24): # Appending the Data hourly
        DataDate = datetime.datetime(Year, Month, Date, hour).isoformat() # Isotime for the given date 0-24
        Data = insertData.getDataByVariable(DataDate)
        DataDict[hour] = Data # Append in dict
    return DataDict

# Accessible URL's

@app.route('/')
def index():
    '''Root site, index.html will be presented'''
    return render_template('index.html') # Flask will look for index.html in /templates

@app.route('/getdata')
def getdata():
    '''Store data from past 6h in nested Dict on /getdata'''
    PastTimeDataDict = {}
    for hour in range(6):
        PastTimeDataDict["curr-"+str(hour)+"h"] = dataListByShiftTime(hour)
    return PastTimeDataDict

# Prevent execution on import & enable on Site Debug
if __name__ == '__main__':
    app.run(debug=True)
