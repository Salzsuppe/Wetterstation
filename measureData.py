### MandatorySetup:
### Change pin var
### Run program by time

# The main function of this file will be the data collection
# It is supposed to split the processing into "Setup&Collection" - Storing - Display

# Global to be able to import
import datetime # Access time to store in DB 
from cfg import config # Pin numeration,

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


    def readGPIOValue():
        '''Store measured values in list'''
        temperature = GPIO.input(config.pinDict['Temperature']) # For simplified processing
        valueList = [] # Empty to fill in loop

        # Append all values that are changed into the list
        changingValues = [currtime, temperature, temperature*9/5+32, temperature+273.15]
        #valueList.append(changingValues) # Append changedValues to the main list
        for value in changingValues:
            valueList.append(value)

        for entry in list(config.pinDict.values()):
            # Append all pin values from pins in pinDict{} to valueList[]
            if entry != 12:
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
        measuredValueResult = ["Nice and fake data", 0, 1, 2, 3, 4, 5, 6, 7, 8]
        print(measuredValueResult)
    return measuredValueResult

# Prevent execution on import (It just works.)
if __name__ == '__main__':
    main()
