# This is a cfg file, only purpose is to be imported

# Declare pins
pinDict = {
    'Temperature':12,
    'Humidity':11,
    'Pressure':13,
    'Rain':15,
    'Wind':16,
    'UV':18,
    'Light':22
    }

# Output regulation Pin
VPin = 22

# Serial connection
serial = {
    'SerialCon':'/dev/ttyUSB0', # Change to USBx/AMAx/ACMx with x as the number of connection
    'Baudrate':'115200' # It has to match with the baudrate of the measuring device
}
# Value Names, for Dict and Table creation(?)
dataEntryList = [
        'DateTime',
        'TemperatureC',
        'TemperatureF',
        'TemperatureK',
        'Humidity',
        'Pressure',
        'Rain',
        'Wind',
        'UV',
        'Light'
        ]
