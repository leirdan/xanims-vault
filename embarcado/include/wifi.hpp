#ifndef WIFI_HPP
#define WIFI_HPP

#include <Arduino.h>
#include <ESP8266WiFi.h>

extern WiFiClient wifi_client;

void WiFi_init(const char *ssid, const char *password);
bool wifiConectado();

#endif
