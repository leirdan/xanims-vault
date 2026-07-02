= Implementação

#text(fill: red)[_Esta seção deve ser finalizada
Esta seção deve deixar claro:
● quais requisitos funcionais foram implementados;
● quais requisitos funcionais não foram implementados;
● quais tecnologias de hardware e software foram utilizadas;
● quais dificuldades foram encontradas durante o desenvolvimento.
_]

== Tecnologias utilizadas

*Hardware:*
- Microcontrolador ESP32 (DevKit C v4);
- Módulo NFC PN532 V3 / leitor RFID-RC522;
- Células de carga de 50 kg (2x ou 4x) com módulo HX711;
- Módulo RTC DS1307 / DS3231 (Real Time Clock, I²C);
- Micro servo motor Tower Pro MG90S (180°) - liberação da ração;
- Micro servo motores SG90 (9g) - válvula da balança e tampa do pote;
- Buzzer ativo 5V;
- Elementos de papelão para representação física do pote e das travas.

*Software:*
- Linguagem C/C++ para programação do ESP32 (firmware embarcado, via Arduino/ESP-IDF);
- Protocolo MQTT, com broker Mosquitto, para comunicação entre backend e embarcado;
- Protocolo HTTP/REST para comunicação entre aplicativo e backend;
- CMS Strapi, com banco de dados SQLite, para armazenamento e cálculo do plano alimentar;
- Aplicativo mobile desenvolvido em MIT App Inventor.

== Dificuldades encontradas

