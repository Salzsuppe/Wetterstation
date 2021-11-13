# The main function of this file will be the data storage in sqlite3
# It is supposed to split the processing into Setup&Collection - "Storing" - Display

# Import lib
import sqlite3 # Our Database
import measureData # 'Storing' depends on 'Collection', also importing currtime

# Var to simplify the code
conn = sqlite3.connect('Raw.db') # The argument which db you want to modify

def createDB():
    '''Create database and its table, if not already existing'''
    conn.execute('''CREATE TABLE RawData
            (DateTime TEXT,
            TemperatureC REAL,
            TemperatureF REAL,
            TemperatureK REAL,
            Humidity INT,
            Pressure REAL,
            Rain INT,
            Wind REAL,
            UV INT );''')
    print("Table created succesfully")
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


def getDataByVariable(DateTime):
    '''Search the DB for DateTime and return the values as List'''
    conn = sqlite3.connect('Raw.db') # Open DB
    cursor = conn.cursor() # Open cursor
    
    # Select any Data where Row DateTime has value $DateTime
    SearchParameter = """SELECT * FROM RawData WHERE DateTime = ?""" 
    
    cursor.execute(SearchParameter, (DateTime,)) # Appending the var Value into the execute statement
    completeRecords = cursor.fetchall() # Fetching the entire DB
    DataRecords = []
    for row in completeRecords: # Fetching all results containing $currtime from $completeRecords
        print(DateTime)
        DataRecords = {
                'DateTime':row[0],
                'TemperatureC':row[1],
                'TemperatureF':row[2],
                'TemperatureK':row[3],
                'Humidity':row[4],
                'Pressure':row[5],
                'Rain':row[6],
                'Wind':row[7],
                'UV':row[8]
                }
        print(DataRecords)
    cursor.close
    conn.close()
    return DataRecords


def main():
    '''Create table and insert Values'''
    try:
        createDB()
    except:
        print("Table creation failed, already existing?")

    insertValuesInTable()
    getDataByVariable(measureData.currtime) # Just called to show nicely the inserted data

# Prevent execution on import (It just works.)
if __name__ == '__main__':
    main()
