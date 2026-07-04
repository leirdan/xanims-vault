#include "container.hpp"

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
    }
    else if (!container_is_open() && !close)
    {
        container_open = true;
        Serial.println("Container aberto.");
    }
}