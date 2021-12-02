# The main function of this file will be the data extraction from sqlite3
# It is supposed to split the processing into Setup - Collection - Storing - "Extraction" - Display

# This is a module, supposed to be import, not executed

# Import lib
import sqlite3 # Our Database
from sensor.cfg import config

def getDataByVariable(DateTime):
    '''Search the DB for DateTime and return the values as List'''
    conn = sqlite3.connect('Raw.db') # Open DB
    cursor = conn.cursor() # Cursor can execute sql statements

    # Select any Data where Row DateTime has value $DateTime
    SearchParameter = """SELECT * FROM RawData WHERE DateTime = ?"""

    cursor.execute(SearchParameter, (DateTime,)) # Appending the var Value into the execute statement
    completeRecords = cursor.fetchall() # Fetching the entire DB
    Values = []
    for row in completeRecords: # Rearanging Values from complete Records, to ensure correct zip()
        Values = [row[pos] for pos in range(len(row))]

    Names = config.dataEntryList
    DataRecords = dict(zip(Names, Values)) # Merge ValueNames with Values into one dict()
    cursor.close
    conn.close()
    print(DataRecords)
    return DataRecords


def getAvg(dictTuple):
    '''Returns the avg of a list of tuples {'xyz':(1,2,3),'xyza'(2,4,6)} = 1.5, 3, 4.5'''
    listTuple = [values for values in dictTuple.values()] # Convert dict to list
    valueList = []
    for position in range(len(listTuple)):
        sortedVal = [Tuple[position] for Tuple in listTuple] # grabs value at loop position for each Tuple inside the list
        listVal = [entry[position] for entry in listTuple] # The tuple to learn its lenght
        average = sum(sortedVal)/len(listVal)
        valueList.append(average)
    
    Names = [name for name in config.dataEntryList if name != config.dataEntryList[0]] # Import Dict names, cut DateTime
    AverageDict = dict(zip(Names, valueList)) # Convert list back to dict
    print(AverageDict)
    return AverageDict