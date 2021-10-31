### Mandatory setup:
### pip install datetime, sqlite3, RPi.GPIO
### sudo timedatectl set-timezone Europe/Berlin
### Change test.db to *.db (delete any test.db)
### Run by time, either hourly by crontab or wait(3600)
### Change PIN var's
### Lennard BUS information transfer

###### Code Todo:
# In main(), get variables from readGPIOvalue() and push to insertVariable into table


# Import used lib
import datetime # Time
import sqlite3 # Our DB
import RPi.GPIO as GPIO # Access the pins

# Set up some var
conn = sqlite3.connect('test.db') # Shortening argument lenght
currtime = datetime.datetime.now().replace(microsecond=0).isoformat() # Store current time in ISO8601
    
# The Pins (pyhsical, since we declared BOARD later)
PIN_Temperature = 7
PIN_Humidity = 11
PIN_Pressure = 13
PIN_Rain = 15
PIN_Wind = 16
PIN_UV = 18

# Some function configuration
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

# Create database table, if not already existing
try:
    conn.execute('''CREATE TABLE RawData 
            (Temperature REAL,
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
    # Do we even need OUT? Perhaps to only provide power when programm running?

# Get Pin Values
def readGPIOValue():
    global Temperature_val
    global Humidity_val
    global Pressure_val
    global Rain_val
    global Wind_val
    global UV_val

    Temperature_val = GPIO.input(PIN_Temperature)
    Humidity_val = GPIO.input(PIN_Humidity)
    Pressure_val = GPIO.input(PIN_Pressure)
    Rain_val = GPIO.input(PIN_Rain)
    Wind_val = GPIO.input(PIN_Wind)
    UV_val = GPIO.input(PIN_UV)

# Setup DB functions 
def insertVariableInTable(INTemperature_val, INHumidity_val, INPressure_val, INRain_val, INWind_val, INUV_val, INDateTime_val):
    # Variables used in the INSERT function, too shorten it
    conn = sqlite3.connect('test.db')
    cursor = conn.cursor()
    InsertParameter = """INSERT INTO RawData
            (Temperature, Humidity, Pressure, Rain, Wind, UV, DateTime)
            VALUES (?, ?, ?, ?, ?, ?, ?);"""
    DataCollection = (INTemperature_val, INHumidity_val, INPressure_val, INRain_val, INWind_val, INUV_val, INDateTime_val)

    cursor.execute(InsertParameter, DataCollection) # The actual INSERT function
    conn.commit()
    print("Data inserted in RawData", cursor.rowcount)
    cursor.close()


### I dont think it will, but might break on runtime >= 1s, just here to remember it would be related to currtime
def getDataByVariable(DateTime):
    conn = sqlite3.connect('test.db')
    cursor = conn.cursor()
    SearchParameter = """SELECT * FROM RawData WHERE DateTime = ?""" # I assume the * selects everything, it works

    cursor.execute(SearchParameter, (DateTime,)) # The actual SEARCH function
    completeRecords = cursor.fetchall() # Fetching the entire thing
    print("Records containing the current Time") 
    for row in completeRecords: # Fetching all results containing $currtime from entire records
        print("Temperature =", row[0])
        print("Humidity =", row[1])
        print("Pressure =", row[2])
        print("Rain =", row[3])
        print("Wind =", row[4])
        print("UV =", row[5])
    cursor.close

def main():
    declareGPIOstate()
    readGPIOValue()
    print(Temperature_val)
    insertVariableInTable(Temperature_val, Humidity_val, Pressure_val, Rain_val, Wind_val, UV_val, currtime)
    getDataByVariable(currtime)

main()
# Cleanup
GPIO.cleanup()
conn.close()
