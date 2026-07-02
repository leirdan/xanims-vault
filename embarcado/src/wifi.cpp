#include "wifi.hpp"

WiFiClient wifi_client;

void WiFi_init(const char *ssid, const char *password)
{
  Serial.print("Conectando ao WiFi");
  WiFi.begin(ssid, password);

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
