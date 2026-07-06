#include "buzzer.hpp"

uint8_t buzzer_pin;

void buzzer_init(uint8_t pin)
{
    buzzer_pin = pin;
    pinMode(buzzer_pin, OUTPUT);
    digitalWrite(buzzer_pin, LOW);
}

void buzzer_bip(int duracaoMs)
{
    digitalWrite(buzzer_pin, HIGH);
    delay(duracaoMs);
    digitalWrite(buzzer_pin, LOW);
}

void buzzer_play_mario()
{
    uint8_t durations[] = {
        100, 100, 0, 100,
        0, 100, 100, 0,
        100, 0, 0, 0,
        100, 0, 0, 0};

    uint8_t pauses[] = {
        100, 100, 100, 100,
        100, 100, 100, 100,
        100, 100, 100, 100,
        100, 100, 100, 100};

    int size = sizeof(durations) / sizeof(int);

    for (int i = 0; i < size; i++)
    {
        if (durations[i] > 0)
        {
            buzzer_bip(durations[i]);
        }
        delay(pauses[i]);
    }
}

void buzzer_play_mario_death()
{
    uint8_t durations[] = {
        80, 80, 80, 0,
        60, 60, 60, 0,
        120, 0, 120, 0,
        100, 100, 250};

    uint8_t pauses[] = {
        50, 50, 50, 100,
        40, 40, 40, 80,
        80, 60, 80, 150,
        100, 100, 50};

    int size = sizeof(durations) / sizeof(int);

    for (int i = 0; i < size; i++)
    {
        if (durations[i] > 0)
        {
            buzzer_bip(durations[i]);
        }
        delay(pauses[i]);
    }
}