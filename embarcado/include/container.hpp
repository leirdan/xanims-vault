#pragma once
#include <ArduinoJson.h>

extern bool container_open;

bool container_is_open();

void container_toggle(bool close = true);