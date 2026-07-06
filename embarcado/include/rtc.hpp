#ifndef RTC_HPP
#define RTC_HPP

#include <Arduino.h>
#include <RTClib.h>

void rtc_init();
DateTime rtc_get_hour();
String rtc_get_formatted_hour();
String rtc_get_iso_date();
bool is_feeding_time();

#endif
