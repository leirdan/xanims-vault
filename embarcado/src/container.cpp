#include "container.hpp"
#include "servo.hpp"

bool container_open = true;

bool container_is_open()
{
    return container_open;
}

void container_toggle(bool close)
{
    if (container_is_open() && close)
    {
        container_open = false;
        Serial.println("Container fechado.");
        servo_close();
    }
    else if (!container_is_open() && !close)
    {
        container_open = true;
        Serial.println("Container aberto.");
        servo_open();
    }
}