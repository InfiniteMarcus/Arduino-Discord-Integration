#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

const int LED_PIN = 13;

String tagId = "Nenhuma";
byte nuidPICC[4];

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

unsigned long start_time; 
unsigned long timed_event;
unsigned long current_time; 

void setup(void) {
  Serial.begin(9600);
  Serial.println("Sistema inicializado");

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
  nfc.begin();

  timed_event = 2500;
	current_time = millis();
	start_time = current_time; 
}

void loop() {
  current_time = millis();
  if (current_time - start_time >= timed_event) {
    readNFC();
    start_time = current_time;
  }
  receiveMessage();
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
    // tag.print();
    tagId = tag.getUidString();
    Serial.println("tag:" + tagId);
  }
}
