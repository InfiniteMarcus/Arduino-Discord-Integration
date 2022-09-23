#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

#define LED_PIN 13
#define VOLUME_MEASURE_PIN A1
#define VIN 5
#define DELAY_TIME 2500

String tagId = "Nenhuma";
byte nuidPICC[4];

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

int volume = 1;

unsigned long start_time; 
unsigned long timed_event;
unsigned long current_time; 

void setup(void) {
  Serial.begin(9600);
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

  current_time = millis();
  if (current_time - start_time >= DELAY_TIME) {
    readNFC();
    start_time = current_time;
  }
}

void changeVolume() {
  int newVolume = analogRead(VOLUME_MEASURE_PIN);

  if (newVolume != volume) {
    float res = convertVolumeRawValue(newVolume);
    Serial.println("volume:" + String(res));
    volume = newVolume;
  }
}

float convertVolumeRawValue(int raw){
  float Vout = float(raw) * (VIN / float(1023));
  float phys = (Vout)/VIN;
  return phys;
}

void receiveMessage() {
    if (Serial.available() > 0) {
      byte input = Serial.read();

      if (input == 'B') {
        digitalWrite(LED_PIN, LOW);
        delay(250);
        digitalWrite(LED_PIN,HIGH);
      }

      if (input == 'P') {
        digitalWrite(LED_PIN, LOW);
        delay(100);
        digitalWrite(LED_PIN,HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(100);
        digitalWrite(LED_PIN,HIGH);
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