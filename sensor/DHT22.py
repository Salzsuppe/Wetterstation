# This is a script to read the DHT22 
# It requires manual setup since it differs and cannot be used in I2C

def DHT22value():
    import Adafruit_DHT
    from cfg import config 

    sensor = 22 # DHT22
    pin = config.pinDict['DHT22'] # Pull sensor location from config

    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

    if humidity is not None and temperature is not None: # Debug
        return(temperature, humidity)
    else:
        print("Failed to read!")
