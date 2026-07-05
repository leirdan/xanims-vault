#include "servo.hpp"

Servo myServo;

void servo_init(int porta) {
  myServo.attach(porta);
}

void servoFechar()
{
    myServo.write(180);
}

void servoAbrir()
{
    myServo.write(0);
}