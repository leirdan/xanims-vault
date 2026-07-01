#include <Arduino.h>
#include "buzzer.hpp"
#include "nfc.hpp"
#include "rtc.hpp"
#include "wifi.hpp"
#include "api.hpp"

#define NFC_SDA D1
#define NFC_SCL D2
#define BUZZER_PIN D5

#define WIFI_SSID "brisa-4886458"
#define WIFI_SENHA "JycSSR8e"

unsigned long ultimoPrintHorario = 0;

void setup()
{
  Serial.begin(115200);

  Serial.println("Starting Xanim's Vault...");

  inicializarNfc(NFC_SDA, NFC_SCL);
  inicializarRtc();
  inicializarWifi(WIFI_SSID, WIFI_SENHA);
}

void loop()
{
  if (millis() - ultimoPrintHorario >= 1000)
  {
    ultimoPrintHorario = millis();
    Serial.print("Horário atual: ");
    Serial.println(obterHorarioFormatado());
  }

  String tagColeira = lerColeira();

  if (tagColeira != "")
  {
    Serial.print("Tag lida: ");
    Serial.println(tagColeira);

    bool poteCorreto = (tagColeira == "87A7C464");

    if (poteCorreto)
    {
      Serial.println("Gato reconhecido! Liberando comida...");
      tocarMusica(BUZZER_PIN);
    }
    else
    {
      Serial.println("Gato não reconhecido (Invasor)!");
    }

    // peso  fixo em 0 ate ter o sensor de peso integrado
    enviarEventoAlimentacao(tagColeira, poteCorreto, 0.0, obterHorarioFormatado());

    delay(2000);
  }
  
  delay(100);
}