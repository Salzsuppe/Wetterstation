# import getData
from logging import debug
from flask import Flask, render_template
import getData
import datetime
import test

def dataListByShiftTime(shift_val):
    '''Search DB by current Time shifted by shift_val'''
    ShiftedTime = datetime.datetime.now().replace(microsecond=0, second=0, minute=0) + datetime.timedelta(hours=shift_val)
    isoformatTime = ShiftedTime.isoformat()
    return getData.getDataByVariable(isoformatTime)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/getdata')
def getdata():
    PastTimeDataDict = {
            'curr-0h': dataListByShiftTime(0),
            'curr-1h': dataListByShiftTime(-1),
            'curr-2h': dataListByShiftTime(-2),
            'curr-3h': dataListByShiftTime(-3),
            'curr-4h': dataListByShiftTime(-4),
            'curr-5h': dataListByShiftTime(-5),
            }
    # syntax for fetching data from nested dict
    #print(PastTimeDataDict['curr-0h']['TemperatureC'])
    return PastTimeDataDict

if __name__ == '__main__':
    app.run(debug=True)
