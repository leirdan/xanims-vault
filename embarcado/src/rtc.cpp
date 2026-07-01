#include "rtc.hpp"

RTC_DS3231 rtc;

void inicializarRtc()
{
  if (!rtc.begin())
  {
    Serial.println("Módulo RTC não encontrado!");
    while (1);
  }

  if (rtc.lostPower())
  {
    Serial.println("RTC sem energia (bateria acabou ou é a primeira vez ligando).");
    Serial.println("Ajustando data/hora para o momento da compilação do código...");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
}

DateTime obterHorarioAtual()
{
  return rtc.now();
}

String obterHorarioFormatado()
{
  DateTime agora = obterHorarioAtual();

  char buffer[9];
  sprintf(buffer, "%02d:%02d:%02d", agora.hour(), agora.minute(), agora.second());

  return String(buffer);
}

bool horarioBateComAlvo(uint8_t horaAlvo, uint8_t minutoAlvo)
{
  DateTime agora = obterHorarioAtual();
  return agora.hour() == horaAlvo && agora.minute() == minutoAlvo;
}
