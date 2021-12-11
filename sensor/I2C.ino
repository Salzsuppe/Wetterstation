// This is the file that will be flashed onto the esp32
#include "BH1750.h"
#include "Adafruit_BMP085.h"

BH1750 lightMeter;
Adafruit_BMP085 bmp;;

byte number = 0;

void setup(){

  Serial.begin(115200);
  lightMeter.begin();
  bmp.begin();
}

void loop(){
  // Write serial while the main py requests it
  if (Serial.available()){
    bool state = Serial.read();
    while (state = 1) {
      float lux = lightMeter.readLightLevel();
      int hpa = bmp.readPressure();
      float temp = bmp.readTemperature();
      Serial.print("{'Pressure':");
      Serial.print(hpa);
      Serial.print(",'Light':");
      Serial.print(lux);
      Serial.print(",'Temperature:");
      Serial.print(temp);
      Serial.println("}");
      
      Serial.println(state);
      delay(1000);
    }
  }
}