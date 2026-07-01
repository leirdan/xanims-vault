#include "wifi.hpp"
#include <ESP8266WiFi.h>

void inicializarWifi(const char *ssid, const char *senha)
{
  Serial.print("Conectando ao WiFi");
  WiFi.begin(ssid, senha);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("WiFi conectado! IP: ");
  Serial.println(WiFi.localIP());
}

bool wifiConectado()
{
  return WiFi.status() == WL_CONNECTED;
}
