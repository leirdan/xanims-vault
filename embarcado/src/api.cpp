#include "api.hpp"
#include "wifi.hpp"
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

void enviarEventoAlimentacao(String tagGato, bool poteCorreto, float pesoConsumidoGramas, String horario)
{
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
}

bool buscarHorariosAlimentacao(int horas[], int minutos[], int tamanhoMaximo, int &quantidadeEncontrada)
{
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
}
