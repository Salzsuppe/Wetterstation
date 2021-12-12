// This is the file that will be flashed onto the esp32
#include "BH1750.h"
#include "Adafruit_BMP085.h"
#include "DHT.h"
#include "Adafruit_ADS1X15.h"

// create objects
Adafruit_ADS1115 ads1115;
DHT dht(12, DHT22); // Change first value to connected DHT pin
BH1750 lightMeter;
Adafruit_BMP085 bmp;;

void setup(){
  //Enable deep sleep wakeup on G4
  esp_sleep_enable_ext0_wakeup(GPIO_NUM_4,HIGH);

  // Start libraries & Serial
  Serial.begin(115200);
  Serial.flush();
  ads1115.begin();
  dht.begin();
  lightMeter.begin();
  bmp.begin();
  delay(250); 

  // Remap voltage from ADC to values
  float wind_vol = (ads1115.readADC_SingleEnded(0)*0.1875/1000); //0.1875 is the ADC resolution
  float UV_vol = (ads1115.readADC_SingleEnded(1)*0.1875/1000);

  // Declare datatypes for the values
  //float TempC = dht.readTemperature();
  float TempC = bmp.readTemperature();
  float TempF = TempC*9/5+32;
  float TempK = TempC+273.15;
  int Humidity = dht.readHumidity();
  float Pressure = bmp.readPressure()/1000; // Convert hpa to bar
  int Rain = int(true); // Conversion to int to save in DB               ADD LATER!
  float Wind = map(wind_vol, 0, 123, 0, 12); // Remap (value, fromLow, fromHigh, toLow, fromHigh)
  float UV = map(UV_vol, 0, 240, 0, 10);
  float Light = lightMeter.readLightLevel();

  // Sending data with something to identify it from the debug entries 
  Serial.printf("\n {IDENTIFIER} %f %f %f %d %f %d %f %f %f \n", TempC, TempF, TempK, Humidity, Pressure, Rain, Wind, UV, Light); //%d:int %f.x:float.round

  esp_deep_sleep_start();
  //Anything beyond start wont be called
}

void loop(){}