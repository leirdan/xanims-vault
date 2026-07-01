#ifndef RTC_HPP
#define RTC_HPP

#include <Arduino.h>
#include <RTClib.h>

void inicializarRtc();
DateTime obterHorarioAtual();
String obterHorarioFormatado();
bool horarioBateComAlvo(uint8_t horaAlvo, uint8_t minutoAlvo);

#endif
