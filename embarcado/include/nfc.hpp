#ifndef NFC_HPP
#define NFC_HPP

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PN532.h>

void inicializarNfc(int pinoSda, int pinoScl);
String lerColeira();

#endif