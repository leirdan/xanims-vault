#include "buzzer.hpp"

int pinoBuzzer;

void buzzer_init(int pino)
{
    pinoBuzzer = pino;
    pinMode(pinoBuzzer, OUTPUT);
    digitalWrite(pinoBuzzer, LOW);
}

void buzzerBipar(int duracaoMs)
{
    digitalWrite(pinoBuzzer, HIGH);
    delay(duracaoMs);
    digitalWrite(pinoBuzzer, LOW);
}

void buzzerTocarMario()
{
    int duracoes[] = {
        100, 100, 0,     100,
        0,   100, 100,   0,
        100, 0,   0,     0,
        100, 0,   0,     0
    };

    int pausas[] = {
        100, 100, 100,   100,
        100, 100, 100,   100,
        100, 100, 100,   100,
        100, 100, 100,   100
    };

    int tamanho = sizeof(duracoes) / sizeof(int);

    for (int i = 0; i < tamanho; i++)
    {
        if (duracoes[i] > 0)
        {
            buzzerBipar(duracoes[i]);
        }
        delay(pausas[i]);
    }
}