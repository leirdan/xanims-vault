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

static bool cache = false;
static String stored_nfc;
static uint16_t stored_portion;
static String stored_hour_1;
static String stored_hour_2;
static String stored_hour_3;
static String stored_hour_4;
static String stored_hour_5;
static String stored_hour_6;

static void load_cache()
{
    if (!prefs.begin("xanims", true))
    {
        Serial.println("Falha ao iniciar partição para carregar cache.");
        return;
    }
    stored_nfc = prefs.getString(nfc_k.c_str(), "");
    stored_portion = prefs.getUInt(portion_k.c_str(), 0);
    stored_hour_1 = prefs.getString(hour1_k.c_str(), "");
    stored_hour_2 = prefs.getString(hour2_k.c_str(), "");
    stored_hour_3 = prefs.getString(hour3_k.c_str(), "");
    stored_hour_4 = prefs.getString(hour4_k.c_str(), "");
    stored_hour_5 = prefs.getString(hour5_k.c_str(), "");
    stored_hour_6 = prefs.getString(hour6_k.c_str(), "");
    prefs.end();
    cache = true;
    Serial.println("Cache da RAM sincronizado com a flash");
}

bool mem_has_data()
{
    if (!cache)
    {
        load_cache();
    }

    if (stored_nfc.length() > 0 &&
        stored_portion != 0
        // stored_hour_1.length() > 0 &&
        // stored_hour_2.length() > 0 &&
        // stored_hour_3.length() > 0 &&
        // stored_hour_4.length() > 0)
    )
    {
        return true;
    }

    return false;
}

void mem_erase()
{
    if (!prefs.begin("xanims"))
    {
        Serial.println("Falha ao iniciar partição.");
        return;
    }

    prefs.clear();
    prefs.end();

    stored_nfc = "";
    stored_portion = 0;
    stored_hour_1 = "";
    stored_hour_2 = "";
    stored_hour_3 = "";
    stored_hour_4 = "";
    stored_hour_5 = "";
    stored_hour_6 = "";
    cache = false;
}

void mem_store_string(String key, String data)
{
    if (!prefs.begin("xanims"))
    {
        Serial.println("Falha ao iniciar partição.");
        return;
    }

    if (prefs.putString(key.c_str(), data.c_str()) != 1)
    {
        Serial.println("Erro ao gravar.");
        prefs.end();
        return;
    }

    prefs.end();
    if (key == nfc_k)
    {
        stored_nfc = data;
    }
    else if (key == hour1_k)
    {
        stored_hour_1 = data;
    }
    else if (key == hour2_k)
    {
        stored_hour_2 = data;
    }
    else if (key == hour3_k)
    {
        stored_hour_3 = data;
    }
    else if (key == hour4_k)
    {
        stored_hour_4 = data;
    }
    else if (key == hour5_k)
    {
        stored_hour_5 = data;
    }
    else if (key == hour6_k)
    {
        stored_hour_6 = data;
    }
}

void mem_store_int(String key, uint16_t data)
{
    if (!prefs.begin("xanims"))
    {
        Serial.println("Falha ao iniciar partição.");
        return;
    }

    if (prefs.putUInt(key.c_str(), data) != 1)
    {
        Serial.println("Erro ao gravar.");
        prefs.end();
        return;
    }

    prefs.end();

    if (key == portion_k)
    {
        stored_portion = data;
    }
}

uint16_t mem_get_int(String key)
{
    if (!cache)
    {
        load_cache();
    }

    if (key == portion_k)
    {
        return stored_portion;
    }

    if (!prefs.begin("xanims", true))
    {
        Serial.println("Falha ao iniciar partição.");
        return 0;
    }

    uint16_t data = prefs.getUInt(key.c_str());
    prefs.end();
    return data;
}

String mem_get_string(String key)
{
    if (!cache)
    {
        load_cache();
    }

    if (key == nfc_k)
    {
        return stored_nfc;
    }
    else if (key == hour1_k)
    {
        return stored_hour_1;
    }
    else if (key == hour2_k)
    {
        return stored_hour_2;
    }
    else if (key == hour3_k)
    {
        return stored_hour_3;
    }
    else if (key == hour4_k)
    {
        return stored_hour_4;
    }
    else if (key == hour5_k)
    {
        return stored_hour_5;
    }
    else if (key == hour6_k)
    {
        return stored_hour_6;
    }

    if (!prefs.begin("xanims", true))
    {
        Serial.println("Falha ao iniciar partição.");
        return "";
    }

    String data = prefs.getString(key.c_str());
    prefs.end();
    return data;
}