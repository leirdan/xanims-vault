#include "nfc.hpp"

Adafruit_PN532 nfc(-1, -1);

void nfc_init(int pinoSda, int pinoScl)
{
  Wire.begin(pinoSda, pinoScl);
  nfc.begin();
  if (!nfc.getFirmwareVersion())
  {
    Serial.println("Placa NFC não encontrado!");
    while (1)
      ;
  }
  Serial.println("Aguardando por uma tag NFC...");
  nfc.SAMConfig();
}

String nfc_read_tag()
{
    uint8_t uid[7];
    uint8_t uidLength;

    if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100))
    {
        String codigoTag = "";
        for (uint8_t i = 0; i < uidLength; i++)
        {
            codigoTag += String(uid[i], HEX);
        }
        codigoTag.toUpperCase();
        return codigoTag;
    }
    return "";
}