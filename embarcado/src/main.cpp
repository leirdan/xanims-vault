#include <Arduino.h>
#include "buzzer.hpp"
#include "nfc.hpp"
#include "rtc.hpp"
#include "wifi.hpp"
#include "api.hpp"
#include "mem.hpp"

#define NFC_SDA D1
#define NFC_SCL D2
#define BUZZER_PIN D5

#define WIFI_SSID "brisa-4886458"
#define WIFI_SENHA "JycSSR8e"
// #define WIFI_SSID "amo musica"
// #define WIFI_SENHA "Th3Summ0n1ng"

unsigned long ultimoPrintHorario = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println("Starting Xanim's Vault...");

  nfc_init(NFC_SDA, NFC_SCL);
  // inicializarRtc();
  MQTT_init();
  WiFi_init(WIFI_SSID, WIFI_SENHA);
}

void loop()
{
  if (millis() - ultimoPrintHorario >= 1000)
  {
    ultimoPrintHorario = millis();
    // Serial.print("Horário atual: ");
    // Serial.println(obterHorarioFormatado());
  }

  MQTT_connect();
  mqtt.processPackets(100);

  if (!mem_has_data())
  {
    String tagColeira = nfc_read_tag();

    if (tagColeira != "")
    {
      Serial.print("Tag lida: ");
      Serial.println(tagColeira);

      JsonDocument payload;
      payload["nfc"] = tagColeira;
      String raw_payload;
      serializeJson(payload, raw_payload);
      mqtt_cat_nfc.publish(raw_payload.c_str());
      delay(2000);
  }
  }
  else {
    Serial.println("Tem dados! Skippando...");
    mem_erase(); // COMENTAR QUANDO QUISER MANTER
    // TODO: toda a lógica do idle
  }

  delay(100);
}