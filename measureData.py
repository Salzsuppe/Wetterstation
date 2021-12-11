# Import Library
from apscheduler.schedulers.blocking import BlockingScheduler # Running the program periodically
import datetime # Store time
import serial # Serial communication
from sensor.cfg import config # Import intervalt
#import RPi.GPIO as GPIO # Set ESP deep sleep status

sched = BlockingScheduler()

port, baud = [value for value in list(config.serial.values())] # Get config values
ser = serial.Serial(port, baud, timeout=1) # Configure serial with the config file
ser.flush() # Configure serial to wait until serial write is done before continuing

#GPIO.setup(config.VPin, GPIO.OUT)

@sched.scheduled_job('cron', second=0) ### Change to minute=0
def measureValues():
    '''Wake the esp for data measurement, acquire the data and return'''
    print("Execution Time:"+str(datetime.datetime.now()))
    timeout = 0
    answer = None
    #GPIO.output(config.VPin, HIGH) # Disable Deep sleep
    while timeout < 5:
        ser.write(str.encode("getVal")) # Trigger esp program
        print("Wake message sent")
        answer = ser.readline().decode('utf-8').rstrip() # esp sent data
        print(answer)
sched.start()