#ifndef WIFI_HPP
#define WIFI_HPP

#include <Arduino.h>

void inicializarWifi(const char *ssid, const char *senha);
bool wifiConectado();

#endif
