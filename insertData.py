# The main function of this file will be the data storage in sqlite3
# It is supposed to split the processing into Setup - Collection - "Storing" - Extraction - Display

# This is file is a program, on execution it will create a DB entry with the current Values

# Import lib
import sqlite3 # Our Database
import measureData # 'Storing' depends on 'Collection'
from sensor.cfg import config

# Var to simplify the code
conn = sqlite3.connect('Raw.db') # The argument which db you want to modify

def createDB():
    '''Create database and its table, if not already existing'''
    conn.execute("""CREATE TABLE IF NOT EXISTS RawData 
            (DateTime TEXT,
            TemperatureC REAL,
            TemperatureF REAL,
            TemperatureK REAL,
            Humidity INT,
            Pressure REAL,
            Rain INT,
            Wind REAL,
            UV INT );""")
    conn.close()


def insertValuesInTable():
    '''Variables used in the INSERT function, to shorten it'''
    conn = sqlite3.connect('Raw.db') # Open DB
    cursor = conn.cursor() # Open cursor

    InsertParameter = """INSERT INTO RawData
            (DateTime, TemperatureC, TemperatureF, TemperatureK, Humidity, Pressure, Rain, Wind, UV)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"""
    DataCollection = measureData.main() # Fetching the data list from measureData.py

    # The INSERT function, using the $DataCollection to insert as var in the $InserParameter
    # Combined it is the command to append into the DB
    cursor.execute(InsertParameter, DataCollection)
    conn.commit()
    print("Rows affected:", cursor.rowcount)
    cursor.close()
    conn.close()


def main():
    '''Create table and insert Values'''
    createDB()
    insertValuesInTable()

# Prevent execution on import (It just works.)
if __name__ == '__main__':
    main()
