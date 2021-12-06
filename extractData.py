# The main function of this file will be the data extraction from sqlite3
# It is supposed to split the processing into Setup - Collection - Storing - "Extraction" - Display

# This is a module, supposed to be import, not executed

# Import lib
import sqlite3 # Our DB
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


def getAvg(dictDict):
    '''Returns the avg of a list of tuples {'xyz':(1,2,3),'xyza'(2,4,6)} = 1.5, 3, 4.5'''
    listofDict = [values for values in dictDict.values()] # Convert dict to list
    sortedList = [] # Arraging the values for calc
    valueList = [] # For the finished calc
    for position in range(len(listofDict)):
        for Dictionary in listofDict:
            if (len(Dictionary) != 0):
                del Dictionary[list(Dictionary.keys())[0]] # Deletes the first entry (DateTime) in Dict
                print(position)
                print(Dictionary.values())
                val = list(Dictionary.values())[(position)]
                sortedList.append(val)
        average = sum(sortedList)/len(sortedList)
        valueList.append(average)
    [print(str(x)) for x in valueList]
    #Names = [name for name in config.dataEntryList if name != config.dataEntryList[0]] # Import Dict names, cut DateTime
    #AverageDict = dict(zip(Names, valueList)) # Convert list back to dict
    #print(AverageDict)
    return valueList
