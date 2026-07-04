#ifndef RTC_HPP
#define RTC_HPP

#include <Arduino.h>
#include <RTClib.h>

void rtc_init();
DateTime rtc_get_hour();
String rtc_get_formatted_hour();
String rtc_get_iso_date();
bool horarioBateComAlvo(uint8_t horaAlvo, uint8_t minutoAlvo);

#endif
