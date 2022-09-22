#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

const int LED_PIN = 13;

String tagId = "Nenhuma";
byte nuidPICC[4];

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

void setup(void) {
 Serial.begin(9600);
 Serial.println("Sistema inicializado");

 pinMode(LED_PIN, OUTPUT);
 digitalWrite(LED_PIN, HIGH);
 nfc.begin();
}

void loop() {
  readNFC();
}

void readNFC() {
 if (nfc.tagPresent()) {
   NfcTag tag = nfc.read();
   // tag.print();
   tagId = tag.getUidString();
   Serial.println("tag:" + tagId);
 }
 delay(2000);
}
