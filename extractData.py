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
    print("Extracted Data:"+str(DataRecords))
    return DataRecords


def getAvg(dictDict):
    '''Returns the avg of nestedDict {"curr-0h":{"TmpC":1,"TmpF":2},"curr-1h":{"TmpC":2,"TmpF":4}} = {"TmpC":1.5,"TmpF":3}'''
    # !!!Note: No data will result in a lower average (1+3+0)/3 != (1+3)/2 !!!
    ListDict = list(dictDict.values()) # Changes the outer Dict in a list
    ValueDict = {}
    for subDict in ListDict: # Removes DateTime string
        try:
            del subDict["DateTime"]
            print("NoDateTimeDict:"+str(subDict))
        except KeyError: # Prevent error on nonexistend data
            print("No DateTime found for deletion")
            print("NoDateTimeDict:"+str(subDict))

        for Key in subDict:
            # For each Key in subDict, add Key[val]/lenght at Key position in ValueDict
            KeyVal = subDict[Key]
            lenght = len(dictDict)
            ValueDict[Key] = ValueDict.get(Key,0)+(KeyVal/lenght) # Create the entry (if not existing) and add value
    print("ValueDict: "+str(ValueDict))
    return ValueDict