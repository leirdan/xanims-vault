#ifndef BUZZER_HPP
#define BUZZER_HPP

#include <Arduino.h>

void buzzer_init(uint8_t pin);
void buzzer_play_mario();
void buzzer_play_mario_death();

#endif