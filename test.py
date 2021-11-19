import sqlite3
from cfg import config
conn = sqlite3.connect('draw.db')
def createDB():
    '''Create database and its table, if not already existing'''
    conn.execute("""CREATE TABLE IF NOT EXISTS RawData
            (? TEXT,
            ? REAL,
            ? REAL,
            ? REAL,
            ? INT,
            ? REAL,
            ? INT,
            ? REAL,
            ? INT );""", [config.dataEntryList])
    conn.close()
createDB()
