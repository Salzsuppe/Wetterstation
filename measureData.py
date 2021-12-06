# The main function of this file will be the data collection
# It is supposed to split the processing into "Setup" - Collection - Storing - Extraction - Display

# This is a module, supposed to be imported, on execution data wont be stored

# Check Pin var
# Check Readme.md links

# Import lib
import datetime # Access time to store in DB 
from sensor.cfg import config # Pin numeration,

# nonISO is used in dataListByshiftTime(nonISOtime) 
nonISOtime = datetime.datetime.now().replace(microsecond=0, second=0, minute=0) # Cut ms, s & m
currtime = nonISOtime.isoformat()


def measureValues():
    # Import lib
    import RPi.GPIO as GPIO # Access the pins

    # Necessary configuration functions
    GPIO.setmode(GPIO.BOARD)
    GPIO.setwarnings(False)

    def declareGPIOstate():
        '''Input declaration'''
        chan_list = list(config.pinDict.values()) # Use values() to isolate the values
        GPIO.setup(chan_list, GPIO.IN)
       
        # make sure VPIN is regulating 3.3V instead of 5V
        GPIO.setup(config.VPin, GPIO.OUT)

    def readGPIOValue():
        '''Store measured values in list'''
        GPIO.output(config.VPin, GPIO.HIGH) # Enable voltage regulation pin

        temperature = GPIO.input(config.pinDict['Temperature']) # For simplified processing
        valueList = [] # Empty to fill in loop

        # Modifying Values 
        changingValues = [currtime, temperature, temperature*9/5+32, temperature+273.15]
        
        # Append changingValues to the main list
        for value in changingValues:
            valueList.append(value)

        for entry in list(config.pinDict.values()):
            # Append all pin values from pins in pinDict{} to valueList[]
            if entry != config.pinDict['Temperature']:
                valueList.append(GPIO.input(entry))
        
        return valueList
    

    # Executing functions in measureValues() to return the list
    declareGPIOstate()
    valueResults = readGPIOValue()
    
    GPIO.cleanup() # Setting all modified pins back to default
    return valueResults



# Try except to allow the program to run without RPi GPIO lib, with fake values. (Win10 compatibility)
def main():
    '''Execute all previous functions'''
    try:
        measuredValueResult = measureValues()
    except:
        measuredValueResult = [currtime, 0, 1, 2, 3, 4, 1, 6, 7]

    print(measuredValueResult)
    return measuredValueResult

def debugmain():
    val = measureValues()
    print(val)
    return val

# Prevent execution on import (It just works.)
if __name__ == '__main__':
    # Change to main()/debugmain() depending on the need 
    debugmain() 
