#include "rtc.hpp"
#include "mem.hpp"

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

bool is_feeding_time()
{
  // return true;
  DateTime now = rtc_get_hour();
  char current_time_str[6];
  sprintf(current_time_str, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  String keys[] = {hour1_k, hour2_k, hour3_k, hour4_k, hour5_k, hour6_k};

  for (int i = 0; i < 6; i++)
  {
    String stored_time = mem_get_string(keys[i]);
    if (stored_time.length() >= 7)
    {
      if (stored_time.substring(0, 7) == String(current_time_str))
      {
        return true;
      }
    }
  }

  return false;
}
