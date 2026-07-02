#ifndef API_HPP
#define API_HPP

#include <Arduino.h>
#include <ArduinoJson.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"
#include "wifi.hpp"

#define API_BASE_URL "http://192.168.1.67:3000"
#define MQTT_SERVER_IP "192.168.1.67"
#define MQTT_SERVER_PORT 1883
#define MQTT_USERNAME "embedded"
#define MQTT_PASSWORD "embedded"

extern Adafruit_MQTT_Client mqtt;

extern Adafruit_MQTT_Publish mqtt_cat_nfc;
extern Adafruit_MQTT_Subscribe mqtt_cat_sync; 
extern Adafruit_MQTT_Publish mqtt_cat_intruder ;
extern Adafruit_MQTT_Publish mqtt_feed_register ;

void MQTT_connect();
void MQTT_cat_sync_callback(char *data, uint16_t len);
void MQTT_init();

void enviarEventoAlimentacao(String tagGato, bool poteCorreto, float pesoConsumidoGramas, String horario);
bool buscarHorariosAlimentacao(int horas[], int minutos[], int tamanhoMaximo, int &quantidadeEncontrada);

#endif
