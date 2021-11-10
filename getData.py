### Mandatory setup:
### pip install datetime, sqlite3, RPi.GPIO
### sudo timedatectl set-timezone Europe/Berlin
### Run by time, either hourly by crontab or wait(3600)
### Change PIN var's
### Lennard BUS information transfer

######### USE Python3! ##########
###### Code Todo:

#optionally:
# Split Pins and others in cfg files
# Make lists

# Import used lib
import datetime # Time
import sqlite3 # Our DB
import RPi.GPIO as GPIO # Access the pins

# Set up some var
conn = sqlite3.connect('Raw.db') # Shortening argument lenght
currtime = datetime.datetime.now().replace(microsecond=0).isoformat() # Store current time in ISO8601

# The Pins (pyhsical, since we declared BOARD later)
PIN_Temperature = 12
PIN_Humidity = 11
PIN_Pressure = 13
PIN_Rain = 15
PIN_Wind = 16
PIN_UV = 18

Data_val = [] # List to store pin values

TemperatureC = None

# Some function configuration
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

# Create database table, if not already existing
def connectDB():
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

# Declaring functions
# Input declaration, not necessary in a function, but makes it more comfortable in execution.
### MAY CHANGE WITH BUS
def declareGPIOstate():
    #IN
    chan_list = [PIN_Temperature,PIN_Humidity,PIN_Pressure,PIN_Rain,PIN_Wind,PIN_UV]
    GPIO.setup(chan_list, GPIO.IN)

# Get Pin Values
def readGPIOValue():
    return dict(
            TemperatureC_val = GPIO.input(PIN_Temperature),
            TemperatureF_val = GPIO.input(PIN_Temperature)*9/5+32, # Same as TemperatureC_val*9/5+32, cant access it tho
            TemperatureK_val = GPIO.input(PIN_Temperature)+273.15, # Same as TemperatureC_val+273.15,
            Humidity_val = GPIO.input(PIN_Humidity),
            Pressure_val = GPIO.input(PIN_Pressure),
            Rain_val = GPIO.input(PIN_Rain),
            Wind_val = GPIO.input(PIN_Wind),
            UV_val = GPIO.input(PIN_UV),
        )
# Setup DB functions
def insertVariableInTable():
    # Variables used in the INSERT function, too shorten it
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

### I dont think it will, but might break on runtime >= 1s, just here to remember it would be related to currtime
def getDataByVariable(DateTime):
    conn = sqlite3.connect('Raw.db')
    cursor = conn.cursor()
    SearchParameter = """SELECT * FROM RawData WHERE DateTime = ?""" # I assume the * selects everything, it works

    cursor.execute(SearchParameter, (DateTime,)) # The actual SEARCH function
    completeRecords = cursor.fetchall() # Fetching the entire thing
    print("Records containing the current Time")
    for row in completeRecords: # Fetching all results containing $currtime from entire records
        print(DateTime)
        DataRecords = [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]]
    cursor.close

def main():
    connectDB()
    declareGPIOstate()
    readGPIOValue()
    insertVariableInTable()
    getDataByVariable(currtime)

if __name__ == '__main__':
    main()
    # Cleanup
    GPIO.cleanup()
    conn.close()
