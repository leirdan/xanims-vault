#include "wifi.hpp"

WiFiClient wifi_client;

void WiFi_init(const char *ssid, const char *password)
{
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  Serial.print("Conectando ao WiFi...");
  WiFi.begin(ssid, password);

  uint32_t start = millis();
  const uint32_t TIMEOUT_MS = 15000;

  while (WiFi.status() != WL_CONNECTED)
  {
    if (millis() - start > TIMEOUT_MS)
    {
      Serial.println();
      Serial.print("Falha ao conectar. Status: ");
      Serial.println(WiFi.status());
      return;
    }
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("WiFi conectado! IP: ");
  Serial.println(WiFi.localIP());
}