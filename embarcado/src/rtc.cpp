#include "rtc.hpp"

RTC_DS3231 rtc;

void rtc_init()
{
  Wire.begin(D1, D2);
  if (!rtc.begin())
  {
    Serial.println("Módulo RTC não encontrado!");
    while (1)
      ;
  }

  if (rtc.lostPower())
  {
    Serial.println("RTC sem energia (bateria acabou ou é a primeira vez ligando).");
    Serial.println("Ajustando data/hora para o momento da compilação do código...");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
}

DateTime rtc_get_hour()
{
  return rtc.now();
}

String rtc_get_formatted_hour()
{
  DateTime now = rtc_get_hour();

  char buffer[9];
  sprintf(buffer, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());

  return String(buffer);
}

String rtc_get_iso_date()
{
  DateTime now = rtc_get_hour();
  char buffer[20];
  sprintf(buffer, "%04d-%02d-%02dT%02d:%02d:%02d",
          now.year(), now.month(), now.day(),
          now.hour(), now.minute(), now.second());
  return String(buffer);
}

bool horarioBateComAlvo(uint8_t horaAlvo, uint8_t minutoAlvo)
{
  DateTime now = rtc_get_hour();
  return now.hour() == horaAlvo && now.minute() == minutoAlvo;
}
