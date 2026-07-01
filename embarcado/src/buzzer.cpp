#include "buzzer.hpp"

int melody[] =
{
  1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 0, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1
};

int durations[] =
{
  349, 601, 349, 349, 224, 349, 224, 349,
  349, 349, 349, 349, 349, 849, 349, 601,
  349, 349, 349, 349, 349, 349, 349, 349,
  349, 349, 849, 349, 251, 599, 349, 349,
  349, 599, 349, 349, 349, 349, 849, 349,
  251, 599, 349, 349, 349, 599, 349, 349,
  349, 349, 849
};

const int totalNotes = sizeof(melody) / sizeof(melody[0]);

void tocarMusica(int pinoBuzzer)
{
  pinMode(pinoBuzzer, OUTPUT);
  digitalWrite(pinoBuzzer, LOW);

  float velocidade = 1.7; 

  for (int i = 0; i < totalNotes; i++) {
    int duracao = durations[i] / velocidade; 

    if (melody[i] == 0) {
      digitalWrite(pinoBuzzer, LOW);
    } else {
      digitalWrite(pinoBuzzer, HIGH);
    }

    delay(duracao);
    digitalWrite(pinoBuzzer, LOW);
    delay(30 / velocidade); 
  }
}