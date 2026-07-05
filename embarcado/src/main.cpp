#include <Arduino.h>
#include "container.hpp"
#include "buzzer.hpp"
#include "nfc.hpp"
#include "rtc.hpp"
#include "wifi.hpp"
#include "api.hpp"
#include "mem.hpp"

#define NFC_SDA D1
#define NFC_SCL D2
#define BUZZER_PIN D5

// #define WIFI_SSID "brisa-4886458"
// #define WIFI_SENHA "JycSSR8e"
#define WIFI_SSID "amo musica"
#define WIFI_SENHA "Th3Summ0n1ng"

unsigned long ultimoPrintHorario = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println("Starting Xanim's Vault...");

  nfc_init(NFC_SDA, NFC_SCL);
  rtc_init();
  MQTT_init();
  WiFi_init(WIFI_SSID, WIFI_SENHA);
}

void loop()
{
  if (millis() - ultimoPrintHorario >= 1000)
  {
    ultimoPrintHorario = millis();
    Serial.print("Horário atual: ");
    Serial.println(rtc_get_formatted_hour());
  }

  MQTT_connect();
  mqtt.processPackets(100);

  String nfc_tag = nfc_read_tag();

  if (!mem_has_data() && nfc_tag != "")
  {
    Serial.print("Tag lida: ");
    Serial.println(nfc_tag);

    JsonDocument payload;
    payload["nfc"] = nfc_tag;
    String raw_payload;
    serializeJson(payload, raw_payload);
    mqtt_cat_nfc.publish(raw_payload.c_str());
    delay(2000);
  }
  else if (nfc_tag != "")
  {
    // mem_erase(); // COMENTAR QUANDO QUISER MANTER
    String stored_nfc = mem_get_string(nfc_k);
    Serial.print("Stored NFC: ");
    Serial.println(stored_nfc);
    Serial.print("Read NFC: ");
    Serial.println(nfc_tag);
    if (stored_nfc == nfc_tag)
    {
      // check container state and opens if its open
      Serial.println("Autorizado.");
    }
    else // handle intruder:
    {
      Serial.println("Intruso.");
      // if container is opened then closes it
      container_toggle(true);
      // esp sends invasion alert through mqtt topic to api
      String invasion_alert = rtc_get_iso_date();
      Serial.print("Hora da invasão: ");
      Serial.println(invasion_alert);

      MQTT_send_invasor_alert(stored_nfc, nfc_tag, invasion_alert);
      // play something when enemy cat arrives?
    }
  }
  else if (is_feeding_time())
  {
    Serial.println("Horário de alimentar.");
  }
  else
  {
    Serial.println("Nenhuma ação detectada...");
  }

  delay(1000);
}