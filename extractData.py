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
    ListDict = list(dictDict.values()) # Changes the outer Dict in a list
    print(ListDict)
    ValueDict = {}
    for subDict in ListDict: # Removes DateTime string
        del subDict["DateTime"]
        
        for Key in subDict:
            KeyVal = subDict[Key]
            lenght = len(dictDict)
            ValueDict[Key] = ValueDict.get(Key,0)+(KeyVal/lenght) # Create the entry (if not existing) and add value
    return ValueDict


    
    


#getAvg({"curr-0":{"DateTime":2468,"TmpC":2,"TmpF":4},"curr-1":{"DateTime":1234,"TmpC":4,"TmpF":8}})