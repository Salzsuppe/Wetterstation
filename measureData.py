# Import Library
import datetime # Store time
import time
import serial # Serial communication
from sensor.cfg import config # Import intervalt

#Debug
try:
    import RPi.GPIO as GPIO # Set ESP deep sleep status
except:
    print("failed to import RPI")

# nonISO is used in dataListByshiftTime(nonISOtime) 
nonISOtime = datetime.datetime.now().replace(microsecond=0, second=0, minute=0) # Cut ms, s & m
currtime = nonISOtime.isoformat()

def measureValues():
    '''Wake the esp for data measurement, acquire the data and return'''

    # Serial configuration
    port, baud = [value for value in list(config.serial.values())] # Get config values
    ser = serial.Serial(port, baud, timeout=1) # Configure serial with the config file
    ser.flush() # Configure serial to wait until serial write is done before continuing

    # Disabel esp deepsleep with Hight voltage from VPin to (esp)G4
    GPIO.setup(config.VPin, GPIO.OUT)
    GPIO.output(config.VPin, GPIO.HIGH)

    print("Execution Time:"+str(datetime.datetime.now()))
    
    while True:
        answer = ser.readline().decode('utf-8').rstrip() # esp sent data
        print(answer)
        if answer is not None:
            ser.write(bytes(1, 'utf-8')) # Send 1 byte to esp 
            print("Serial break send")
            print("not none answer:"+str(answer))
            return answer
            break
        time.sleep(1)

if __name__ == 'main':
    measureValues()