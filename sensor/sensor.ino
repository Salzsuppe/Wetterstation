// This is the file that will be flashed onto the esp32
// The main function of this file will be the measurement of the sensors
// It is supposed to split the processing into "Measuring" - Collection - Storing - Extraction - Display
#include "BH1750.h"
#include "Adafruit_BMP085.h"
#include "DHT.h"
#include "Adafruit_ADS1X15.h"


//CONFIG:
#define DHTTYPE DHT22 //Change to DHT11 to use it
#define DHTPIN 12 // Pin to access DHT sensor
#define BAUDRATE 115200 // Communication speed (9600) for arduino
#define WAKEPIN GPIO_NUM_4 // Change the last number, note: not all pins are eligable
#define WAKESTATE HIGH //The state, the pin should be to wake the esp
#define ADCSENSITIVITY 0.1875 //The ADS has 0.1875
#define WINDPIN 0 //The Ax connection at ADC
#define UVPIN 1 //The Ax connection at ADC
#define RAINPIN 2 //The Ax connection at ADC

// create objects
Adafruit_ADS1115 ads1115;
DHT dht(DHTPIN, DHTTYPE); // Change first value to connected DHT pin
BH1750 lightMeter;
Adafruit_BMP085 bmp;;

void setup(){
  //Enable deep sleep wakeup on G4
  esp_sleep_enable_ext0_wakeup(WAKEPIN,WAKESTATE);

  // Start libraries & Serial
  Serial.begin(BAUDRATE);
  Serial.flush();
  ads1115.begin();
  dht.begin();
  lightMeter.begin();
  bmp.begin();
  delay(250); 

  // Remap voltage from ADC to values
  float wind_vol = (ads1115.readADC_SingleEnded(WINDPIN)*ADCSENSITIVITY/1000); //0.1875 is the ADC resolution
  float UV_vol = (ads1115.readADC_SingleEnded(UVPIN)*ADCSENSITIVITY/1000);
  float rain_vol = (ads1115.readADC_SingleEnded(RAINPIN)*ADCSENSITIVITY/1000);

  // Declare datatypes for the values
  //float TempC = dht.readTemperature();
  float TempC = bmp.readTemperature();
  float TempF = TempC*9/5+32;
  float TempK = TempC+273.15;
  int Humidity = dht.readHumidity();
  float Pressure = bmp.readPressure()/1000; // Convert hpa to bar
  int Rain = rain_vol;//map(rain_vol, 0, 1, 0, 10); // Conversion to int to save in DB               ADD LATER!
  float Wind = wind_vol;//map(wind_vol, 0, 123, 0, 12); // Remap (value, fromLow, fromHigh, toLow, fromHigh)
  float UV = UV_vol;//map(UV_vol, 0, 240, 0, 10);
  float Light = lightMeter.readLightLevel();

  // Sending data with something to identify it from the debug entries 
  Serial.printf("\n {IDENTIFIER} %f %f %f %d %f %d %f %f %f \n", TempC, TempF, TempK, Humidity, Pressure, Rain, Wind, UV, Light); //%d:int %f.x:float.round

  esp_deep_sleep_start();
  //Anything beyond start wont be called
}

void loop(){}