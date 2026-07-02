#pragma once

#include <Arduino.h>
#include <Preferences.h>

extern Preferences prefs;
extern String nfc_k;
extern String portion_k;
extern String hour1_k;
extern String hour2_k;
extern String hour3_k;
extern String hour4_k;
extern String hour5_k;
extern String hour6_k;

bool mem_has_data();
void mem_erase();
void mem_store_string(String key, String data);
String mem_get_string(String key);
void mem_store_int(String key, uint16_t data);
uint16_t mem_get_int(String key);
