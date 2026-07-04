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
  uint16_t portion = document["portion"];
  JsonArray hours = document["hours"];

  mem_store_string(nfc_k, nfc);
  mem_store_int(portion_k, portion);

  for (size_t i = 0; i < hours.size(); i++)
  {
    mem_store_string(String("HOUR_" + i + 1), hours[i]);
  }

  Serial.println("Dados salvos: ");
  Serial.println(mem_get_string(nfc_k));
  Serial.println(mem_get_int(portion_k));
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

void enviarEventoAlimentacao(String tagGato, bool poteCorreto, float pesoConsumidoGramas, String horario)
{
  /*
  if (!wifiConectado())
  {
    Serial.println("Sem WiFi, não foi possível enviar o evento ao backend.");
    return;
  }

  WiFiClient client;
  HTTPClient http;

  http.begin(client, String(API_BASE_URL) + "/eventos-alimentacao");
  http.addHeader("Content-Type", "application/json");

  JsonDocument corpo;
  corpo["tagGato"] = tagGato;
  corpo["poteCorreto"] = poteCorreto;
  corpo["pesoConsumidoGramas"] = pesoConsumidoGramas;
  corpo["horario"] = horario;

  String corpoJson;
  serializeJson(corpo, corpoJson);

  int codigoResposta = http.POST(corpoJson);

  if (codigoResposta > 0)
  {
    Serial.print("Evento enviado ao backend, resposta: ");
    Serial.println(codigoResposta);
  }
  else
  {
    Serial.print("Falha ao enviar evento ao backend: ");
    Serial.println(http.errorToString(codigoResposta));
  }

  http.end();
  */
}

bool buscarHorariosAlimentacao(int horas[], int minutos[], int tamanhoMaximo, int &quantidadeEncontrada)
{
  // Comentei pq o wificlient tá interfwerindo
  /*
  quantidadeEncontrada = 0;

  if (!wifiConectado())
  {
    Serial.println("Sem WiFi, não foi possível buscar os horários no backend.");
    return false;
  }

  WiFiClient client;
  HTTPClient http;

  http.begin(client, String(API_BASE_URL) + "/horarios-alimentacao");
  int codigoResposta = http.GET();

  if (codigoResposta != 200)
  {
    Serial.print("Falha ao buscar horários no backend: ");
    Serial.println(codigoResposta);
    http.end();
    return false;
  }

  String corpoResposta = http.getString();
  http.end();

  JsonDocument documento;
  DeserializationError erro = deserializeJson(documento, corpoResposta);

  if (erro)
  {
    Serial.print("Erro ao interpretar JSON dos horários: ");
    Serial.println(erro.c_str());
    return false;
  }

  JsonArray horarios = documento.as<JsonArray>();

  for (JsonObject horario : horarios)
  {
    if (quantidadeEncontrada >= tamanhoMaximo)
    {
      break;
    }

    horas[quantidadeEncontrada] = horario["hora"];
    minutos[quantidadeEncontrada] = horario["minuto"];
    quantidadeEncontrada++;
  }

  return true;
  */
  return true;
}
