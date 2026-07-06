#include "servo.hpp"

Servo myServo;

void servo_init(int porta)
{
    myServo.attach(porta);
}

void servo_close()
{
    myServo.write(180);
}

void servo_open()
{
    myServo.write(0);
}