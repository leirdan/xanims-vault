#ifndef NFC_HPP
#define NFC_HPP

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PN532.h>

extern Adafruit_PN532 nfc;

void nfc_init(int pinoSda, int pinoScl);
String nfc_read_tag();

#endif