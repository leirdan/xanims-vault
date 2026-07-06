#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "wifi.hpp"
#include "api.hpp"
#include "mem.hpp"

Adafruit_MQTT_Client mqtt(&wifi_client, MQTT_SERVER_IP, MQTT_SERVER_PORT, MQTT_USERNAME, MQTT_PASSWORD);

Adafruit_MQTT_Publish mqtt_cat_nfc = Adafruit_MQTT_Publish(&mqtt, "cat/nfc");
Adafruit_MQTT_Subscribe mqtt_cat_sync = Adafruit_MQTT_Subscribe(&mqtt, "cat/sync");
Adafruit_MQTT_Publish mqtt_cat_intruder = Adafruit_MQTT_Publish(&mqtt, "cat/intruder");
Adafruit_MQTT_Publish mqtt_feed_register = Adafruit_MQTT_Publish(&mqtt, "feed/register");

void MQTT_connect()
{
  int8_t ret;
  if (mqtt.connected())
  {
    return;
  }
  Serial.print("Conectando ao MQTT... ");
  uint8_t retries = 3;
  while ((ret = mqtt.connect()) != 0)
  {
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Tentando conexão daqui a 5 segundos...");
    mqtt.disconnect();
    delay(5000);
    retries--;
    if (retries == 0)
    {
      while (1)
        ;
    }
  }
  Serial.println("MQTT conectado!");
}

void MQTT_cat_sync_callback(char *data, uint16_t len)
{
  Serial.println("Mensagem recebida no tópico 'cat/sync'.");
  String jsonStr = String(data);
  Serial.println(jsonStr);

  JsonDocument document;
  DeserializationError err = deserializeJson(document, jsonStr);
  if (err)
  {
    Serial.println("JSON em um formato inválido.");
    Serial.println(err.c_str());
    return;
  }

  String nfc = String(document["nfc"]);
  uint16_t portion = (uint16_t)document["portion"];
  JsonArray hours = document["hours"];

  mem_store_string(nfc_k, nfc);
  mem_store_int(portion_k, portion);
  if (hours.size() > 0 && !hours[0].isNull())
    mem_store_string(hour1_k, hours[0].as<String>());
  if (hours.size() > 1 && !hours[1].isNull())
    mem_store_string(hour2_k, hours[1].as<String>());
  if (hours.size() > 2 && !hours[2].isNull())
    mem_store_string(hour3_k, hours[2].as<String>());
  if (hours.size() > 3 && !hours[3].isNull())
    mem_store_string(hour4_k, hours[3].as<String>());
  if (hours.size() > 4 && !hours[4].isNull())
    mem_store_string(hour5_k, hours[4].as<String>());
  if (hours.size() > 5 && !hours[5].isNull())
    mem_store_string(hour6_k, hours[5].as<String>());
}

void MQTT_init()
{
  mqtt_cat_sync.setCallback(MQTT_cat_sync_callback);
  mqtt.subscribe(&mqtt_cat_sync);
}

bool MQTT_send_invasor_alert(String &expected_nfc, String &nfc_intruder, String &timestamp)
{
  char buffer[150];
  JsonDocument payload;
  payload["nfc"] = expected_nfc;
  payload["intruder"] = nfc_intruder;
  payload["date"] = timestamp;
  serializeJson(payload, buffer, sizeof(buffer));
  if (!mqtt_cat_intruder.publish(buffer))
  {
    Serial.println("Falha ao publicar no MQTT...");
    return false;
  }
  Serial.println("Invasor registrado com sucesso.");
  return true;
}

bool MQTT_register_feed(String &nfc, uint8_t amount, String &timestamp)
{
  char buffer[150];
  JsonDocument payload;
  payload["nfc"] = nfc;
  payload["amount"] = amount;
  payload["date"] = timestamp;
  serializeJson(payload, buffer, sizeof(buffer));
  if (!mqtt_feed_register.publish(buffer))
  {
    Serial.println("Falha ao publicar no MQTT...");
    return false;
  }
  Serial.println("Consumo registrado com sucesso.");
  return true;
}