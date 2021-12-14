# The main function of this file will be the data Collection from the esp32
# It is supposed to split the processing into Measuring - "Collection" - Storing - Extraction - Display

# This is a modules, supposed to be imported, on exection it will show the measuredValues, but they wont be stored.

# Import Library
import datetime # Store time
import serial # Serial communication
from cfg import config # Import intervalt

#Debug
try:
    import RPi.GPIO as GPIO # Set ESP deep sleep status
except ModuleNotFoundError:
    print("failed to import RPI")

# nonISO is used in dataListByshiftTime(nonISOtime) 

def measureValues():
    '''Wake the esp for data measurement, acquire the data and send esp to sleep'''

    # Serial configuration
    port, baud = [value for value in list(config.serial.values())] # Get config values
    ser = serial.Serial(port, baud, timeout=1) # Configure serial with the config file
    ser.flush() # Configure serial to wait until serial write is done before continuing

    # Disabel esp deepsleep with Hight voltage from VPin to (esp)G4
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(config.VPin, GPIO.OUT)
    GPIO.output(config.VPin, GPIO.HIGH)

    print("Execution Time:"+str(datetime.datetime.now()))
    
    while True:
        if ser.in_waiting > 0:
            data = ser.readline().decode('utf-8').rstrip() # recieved data
            print("Recieved line:"+str(data))
            if "{IDENTIFIER}" in data: # search to filter data from esp serial debug
                nonISOtime = datetime.datetime.now().replace(microsecond=0, second=0, minute=0) # Cut ms, s & m
                currtime = nonISOtime.isoformat()

                dataList = data.split() # String to List
                print("Recieved Data:"+str(dataList))
                dataList = [currtime if item == '{IDENTIFIER}' else item for item in dataList] # Remakes the list but {ID..} is replaced

                GPIO.cleanup() # Remove power at (esp)G4 
                ser.write(bytes(1)) # Send 1 byte to esp to stop the program
                print("Serial break send")
                ser.close()
                return dataList

if __name__ == '__main__':
    measureValues()