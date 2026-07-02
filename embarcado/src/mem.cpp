#include "mem.hpp"

Preferences prefs;
String nfc_k = "NFC";
String portion_k = "PORTION";
String hour1_k = "HOUR_1";
String hour2_k = "HOUR_2";
String hour3_k = "HOUR_3";
String hour4_k = "HOUR_4";
String hour5_k = "HOUR_5";
String hour6_k = "HOUR_6";

// void mem_init() 
// {
// }

bool mem_has_data() {
    if (!prefs.begin("xanims", true)) {
        Serial.println("Falha ao iniciar partição.");
        return false;
    }

    if (prefs.getString(nfc_k.c_str()).length() > 0 &&
        prefs.getUInt(portion_k.c_str()) != 0) {
            prefs.end();
            return true;
        }

        prefs.end();
        return false;
}

void mem_erase() {
    if (!prefs.begin("xanims"))  {
        Serial.println("Falha ao iniciar partição.");
        return;
    }

    prefs.clear();
    prefs.end();
}

// TODO: dá pra aplicar template num embarcado?
void mem_store_string(String key, String data) 
{
    if (!prefs.begin("xanims"))  {
        Serial.println("Falha ao iniciar partição.");
        return;
    }

    if (prefs.putString(key.c_str(), data.c_str()) != 1) {
        Serial.println("Erro ao gravar.");
        prefs.end();
        return;
    }

    prefs.end();
}

void mem_store_int(String key, uint16_t data) {
    if (!prefs.begin("xanims"))  {
        Serial.println("Falha ao iniciar partição.");
        return;
    }

    if (prefs.putUInt(key.c_str(), data) != 1) {
        Serial.println("Erro ao gravar.");
        prefs.end();
        return;
    }

    prefs.end();

}

uint16_t mem_get_int(String key) {
    if (!prefs.begin("xanims", true))  {
        Serial.println("Falha ao iniciar partição.");
        return 0;
    }

    uint16_t data = prefs.getUInt(key.c_str());
    prefs.end();
    return data;
}

String mem_get_string(String key) {
    if (!prefs.begin("xanims", true))  {
        Serial.println("Falha ao iniciar partição.");
        return "";
    }

    String data = prefs.getString(key.c_str());
    prefs.end();
    return data;
}