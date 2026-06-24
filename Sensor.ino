#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

#define LED_PIN 13
#define VOLUME_MEASURE_PIN A1
#define VIN 5
#define DELAY_TIME 2500
#define VOLUME_DEADBAND 8 // Hysteresis threshold to filter analog sensor noise

String tagId = "Nenhuma";

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

int volume = -1;
int lastReportedVolume = -999;

unsigned long blinkStartTime = 0;
int blinkMode = 0;   // 0 = Idle, 1 = Single blink ('B'), 2 = Double blink ('P')
int blinkState = 0;

unsigned long start_time; 
unsigned long current_time; 

void setup(void) {
  Serial.begin(115200);
  Serial.println("Sistema inicializado");

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
  nfc.begin();

  current_time = millis();
  start_time = current_time; 
}

void loop() {
  changeVolume();
  receiveMessage();
  updateBlink();

  current_time = millis();
  if (current_time - start_time >= DELAY_TIME) {
    readNFC();
    start_time = current_time;
  }
}

void changeVolume() {
  int newVolume = analogRead(VOLUME_MEASURE_PIN);

  if (abs(newVolume - lastReportedVolume) >= VOLUME_DEADBAND || 
      (newVolume == 0 && lastReportedVolume != 0) || 
      (newVolume == 1023 && lastReportedVolume != 1023)) {
    
    float res = convertVolumeRawValue(newVolume);
    Serial.println("volume:" + String(res));
    lastReportedVolume = newVolume;
    volume = newVolume;
  }
}

float convertVolumeRawValue(int raw){
  return (float)raw / 1023.0f;
}

void receiveMessage() {
  if (Serial.available() > 0) {
    byte input = Serial.read();

    if (input == 'B') {
      digitalWrite(LED_PIN, LOW);
      blinkStartTime = millis();
      blinkMode = 1;
      blinkState = 1;
    }

    if (input == 'P') {
      digitalWrite(LED_PIN, LOW);
      blinkStartTime = millis();
      blinkMode = 2;
      blinkState = 1;
    }
  }
}

void updateBlink() {
  if (blinkMode == 0) return;

  unsigned long now = millis();
  if (blinkMode == 1) { 
    if (now - blinkStartTime >= 250) {
      digitalWrite(LED_PIN, HIGH);
      blinkMode = 0;
      blinkState = 0;
    }
  } 
  else if (blinkMode == 2) {
    if (blinkState == 1 && now - blinkStartTime >= 100) {
      digitalWrite(LED_PIN, HIGH);
      blinkStartTime = now;
      blinkState = 2;
    } 
    else if (blinkState == 2 && now - blinkStartTime >= 100) {
      digitalWrite(LED_PIN, LOW);
      blinkStartTime = now;
      blinkState = 3;
    } 
    else if (blinkState == 3 && now - blinkStartTime >= 100) {
      digitalWrite(LED_PIN, HIGH);
      blinkMode = 0;
      blinkState = 0;
    }
  }
}

void readNFC() {
  if (nfc.tagPresent()) {
    NfcTag tag = nfc.read();
    tagId = tag.getUidString();
    Serial.println("tag:" + tagId);
  }
}