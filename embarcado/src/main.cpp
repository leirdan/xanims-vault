#include <Arduino.h>
#include "container.hpp"
#include "buzzer.hpp"
#include "nfc.hpp"
#include "rtc.hpp"
#include "wifi.hpp"
#include "api.hpp"
#include "mem.hpp"
#include "servo.hpp"
#include "container.hpp"

#define NFC_SDA D1
#define NFC_SCL D2
#define BUZZER_PIN D5
#define SERVO_PIN D6

// #define WIFI_SSID "brisa-4886458"
// #define WIFI_SENHA "JycSSR8e"
#define WIFI_SSID "amo musica"
#define WIFI_SENHA "Th3Summ0n1ng"

unsigned long ultimoPrintHorario = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println("Starting Xanim's Vault...");

  mem_erase();
  nfc_init(NFC_SDA, NFC_SCL);
  rtc_init();
  buzzer_init(BUZZER_PIN);
  WiFi_init(WIFI_SSID, WIFI_SENHA);
  MQTT_init();
  servo_init(SERVO_PIN);
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
  mqtt.processPackets(10);

  String nfc_tag = nfc_read_tag();

  if (nfc_tag != "")
  {
    Serial.print("Tag lida: ");
    Serial.println(nfc_tag);
    if (!mem_has_data())
    {
      JsonDocument payload;
      payload["nfc"] = nfc_tag;
      String raw_payload;
      serializeJson(payload, raw_payload);
      mqtt_cat_nfc.publish(raw_payload.c_str());
    }
    else
    {
      String stored_nfc = mem_get_string(nfc_k);
      Serial.print("Tag guardada: ");
      Serial.println(stored_nfc);
      if (stored_nfc == nfc_tag)
      {
        Serial.println("Autorizado.");
        container_toggle(false);
        buzzer_play_mario();
      }
      else
      {
        Serial.println("Invasão detectada! ");
        container_toggle(true);
        String invasion_alert = rtc_get_iso_date();
        Serial.print("Hora da invasão: ");
        Serial.println(invasion_alert);

        MQTT_send_invasor_alert(stored_nfc, nfc_tag, invasion_alert);
        buzzer_play_mario_death();
      }
    }
  }

  if (is_feeding_time() && mem_has_data())
  {
    Serial.println("Horário de alimentar.");
    String nfc = mem_get_string(nfc_k);
    String date = rtc_get_iso_date();
    if (MQTT_register_feed(nfc, mem_get_int(portion_k), date))
    {
      container_toggle(true);
    }
  }
}