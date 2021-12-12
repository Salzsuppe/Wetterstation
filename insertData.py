# The main function of this file will be the data storage in sqlite3
# It is supposed to split the processing into Setup - Collection - "Storing" - Extraction - Display

# This is file is a program, on execution it will create a DB entry with the current Values

# Import lib
import sqlite3 # Our Database
import measureData # 'Storing' depends on 'Collection'
from sensor.cfg import config
from apscheduler.schedulers.blocking import BlockingScheduler # Running the program periodically

scheduler = BlockingScheduler()

def createDB():
    '''Create database and its table, if not already existing'''
    conn = sqlite3.connect('Raw.db') # Open DB
    conn.execute("""CREATE TABLE IF NOT EXISTS RawData 
            (DateTime TEXT,
            TemperatureC REAL,
            TemperatureF REAL,
            TemperatureK REAL,
            Humidity INT,
            Pressure REAL,
            Rain INT,
            Wind REAL,
            UV INT,
            Light REAL );""")
    conn.close()
    print("DB and Table created successfully")


def insertValuesInTable(DataCollection):
    '''Variables used in the INSERT function, to shorten it'''
    createDB()
    conn = sqlite3.connect('Raw.db') # Open DB
    cursor = conn.cursor() # Open cursor

    InsertParameter = """INSERT INTO RawData
            (DateTime, TemperatureC, TemperatureF, TemperatureK, Humidity, Pressure, Rain, Wind, UV, Light)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"""

    # The INSERT function, using the $DataCollection to insert as var in the $InserParameter
    # Combined it is the command to append into the DB
    cursor.execute(InsertParameter, DataCollection)
    conn.commit()
    print("Rows affected:", cursor.rowcount)
    print("insertedData:"+str(DataCollection))
    cursor.close()
    conn.close()

def fakedataDay():
    '''Inserts Data for an entire Day with made up values'''
    import datetime
    for hour in range(24):
        ShiftedTime = measureData.nonISOtime + datetime.timedelta(hours=(hour*-1))
        insertValuesInTable([ShiftedTime.isoformat(), 0, 1, 2, 3, 4, 5, 6, 7, 8])

@scheduler.scheduled_job('cron', minute=0)
def main():
    '''Create table and insert Values periodically'''
    insertValuesInTable(measureData.measureValues())


# Prevent execution on import (It just works.)
if __name__ == '__main__':
    #scheduler.start()
    fakedataDay()
