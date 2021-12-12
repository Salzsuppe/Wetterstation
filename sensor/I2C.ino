// This is the file that will be flashed onto the esp32
#include "BH1750.h"
#include "Adafruit_BMP085.h"

BH1750 lightMeter;
Adafruit_BMP085 bmp;;

void setup(){
  //Enable deep sleep wakeup on G4
  esp_sleep_enable_ext0_wakeup(GPIO_NUM_4,HIGH);

  // Start libraries & Serial
  Serial.begin(115200);
  Serial.flush();
  lightMeter.begin();
  bmp.begin();
  delay(250); 
  
  while (true) {
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

    // Stop program if confirmation is recieved
    int answer = Serial.read();
    if (answer = 1) {
        break;
    }

  }

  esp_deep_sleep_start();
  //Anything beyond start wont be called
}

void loop(){}