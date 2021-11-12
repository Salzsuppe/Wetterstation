### Mandatory setup:
### sudo timedatectl set-timezone Europe/Berlin
### Run by time, either hourly by crontab or wait(3600)
### Change PIN var's

######### USE Python3! ##########
###### Code Todo:

#optionally:
# Split Pins and others in cfg files
# Make lists

# Import used lib
import datetime # Time
import sqlite3 # Our DB

# Allows the program to be execute without RPi GPIO, with fake values.
# Remove try except (((!except createDB()!))) to revert changes
try:
    import RPi.GPIO as GPIO # Access the pins
except:
    print("Failed to import GPIO lib, continue with faked values")

# Set up some var
conn = sqlite3.connect('Raw.db') # Shortening argument lenght
currtime = datetime.datetime.now().replace(microsecond=0, second=0, minute=0).isoformat() # Store current time in ISO and remove ms, s & m


# Set pin numeration to physical
try:
    GPIO.setmode(GPIO.BOARD)
    GPIO.setwarnings(False)
except:
    print("Failed to import GPIO lib, continue with faked values")

# Declare pins
PIN_Temperature = 12
PIN_Humidity = 11
PIN_Pressure = 13
PIN_Rain = 15
PIN_Wind = 16
PIN_UV = 18

def createDB():
    '''Create database table, if not already existing'''
    try:
        conn.execute('''CREATE TABLE RawData
                (TemperatureC REAL,
                TemperatureF REAL,
                TemperatureK REAL,
                Humidity INT,
                Pressure REAL,
                Rain INT,
                Wind REAL,
                UV INT,
                DateTime TEXT );''')
        print("Table created succesfully")
        conn.close()
    except:
        print("Error creating Table, already existing?")

def declareGPIOstate():
    '''Input Declaration'''
    try:
        chan_list = [PIN_Temperature,PIN_Humidity,PIN_Pressure,PIN_Rain,PIN_Wind,PIN_UV]
        GPIO.setup(chan_list, GPIO.IN)
    except:
        print("No state declared")

def readGPIOValue():
    '''Store Pin Values in List'''
    try:
        valueList = [
                GPIO.input(PIN_Temperature),
                GPIO.input(PIN_Temperature)*9/5+32, # Same as TemperatureC_val*9/5+32, cant access it tho
                GPIO.input(PIN_Temperature)+273.15, # Same as TemperatureC_val+273.15,
                GPIO.input(PIN_Humidity),
                GPIO.input(PIN_Pressure),
                GPIO.input(PIN_Rain),
                GPIO.input(PIN_Wind),
                GPIO.input(PIN_UV),
                currtime,
            ]
        return valueList

    except:
        valueList = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        return valueList

# Setup DB functions
def insertVariableInTable(): 
    '''Variables used in the INSERT function, to shorten it'''
    conn = sqlite3.connect('Raw.db')
    cursor = conn.cursor()
    InsertParameter = """INSERT INTO RawData
            (TemperatureC, TemperatureF, TemperatureK, Humidity, Pressure, Rain, Wind, UV, DateTime)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"""
    DataCollection = readGPIOValue() 

    cursor.execute(InsertParameter, DataCollection) # The actual INSERT function
    conn.commit()
    print("Data inserted in RawData", cursor.rowcount)
    cursor.close()

def getDataByVariable(DateTime):
    '''Search the DB for DateTime and return the values as List'''
    conn = sqlite3.connect('Raw.db')
    cursor = conn.cursor()
    SearchParameter = """SELECT * FROM RawData WHERE DateTime = ?""" # Select any Data where Row DateTime has value of Datetime 

    cursor.execute(SearchParameter, (DateTime,)) # Appending the var Value into the execute statement
    completeRecords = cursor.fetchall() # Fetching the entire thing
    DataRecords = []
    for row in completeRecords: # Fetching all results containing $currtime from entire records
        print(DateTime)
        DataRecords = {
                'TemperatureC':row[0],
                'TemperatureF':row[1],
                'TemperatureK':row[2],
                'Humidity':row[3],
                'Pressure':row[4],
                'Rain':row[5],
                'Wind':row[6],
                'UV':row[7]
                }
        print(DataRecords)
    cursor.close
    return DataRecords

def main():
    '''Call all functions'''
    createDB()
    declareGPIOstate()
    readGPIOValue()
    insertVariableInTable()
    getDataByVariable(currtime)

# Prevent execution on import
if __name__ == '__main__':
    main()
    # Cleanup
    try:
        GPIO.cleanup()
    except:
        print("Pin cleanup failed")

    conn.close()
