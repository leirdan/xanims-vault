#ifndef SERVO_HPP
#define SERVO_HPP

#include <Arduino.h>
#include <Servo.h>

void servo_init(int porta);
void servo_close();
void servo_open();

#endif