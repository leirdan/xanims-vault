#ifndef API_HPP
#define API_HPP

#include <Arduino.h>

#define API_BASE_URL "http://192.168.0.100:3000"

void enviarEventoAlimentacao(String tagGato, bool poteCorreto, float pesoConsumidoGramas, String horario);
bool buscarHorariosAlimentacao(int horas[], int minutos[], int tamanhoMaximo, int &quantidadeEncontrada);

#endif
