// This is the file that will be flashed onto the esp32
#include "BH1750.h"
#include "Adafruit_BMP085.h"

BH1750 lightMeter;
Adafruit_BMP085 bmp;;

byte number = 0;

void setup(){
  // Start libraries & Serial
  Serial.begin(115200);
  lightMeter.begin();
  bmp.begin();
  delay(500);
}

void loop(){
  // Write serial while the main py requests it
  if (Serial.available()){
    bool state = Serial.read();
    while (state = 1) {
      // Declare datatypes for the values
      float lux = lightMeter.readLightLevel();
      int hpa = bmp.readPressure();
      float temp = bmp.readTemperature();
      // Writing the date like a dictionary for simple conversion
      Serial.print("{'Pressure':");
      Serial.print(hpa);
      Serial.print(",'Light':");
      Serial.print(lux);
      Serial.print(",'Temperature:");
      Serial.print(temp);
      Serial.println("}");
      
      delay(1000);
      state = Serial.read();
    }
  }
}