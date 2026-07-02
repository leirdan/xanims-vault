# Xanim's Vault

## Tópicos

#### CAT/NFC
- Pub: embedded
- Sub: strapi
Payload:
```json
{ 
    "nfc": "string"
}
```

#### CAT/SYNC
- Pub: strapi
- Sub: embedded
Payload:
```json
{ 
    "nfc": "string",
    "portion": 0,
    "hours": [ 
       "00:00",
       "00:01",
       // ... 
    ]
}
```

#### CAT/INTRUDER
- Pub: embedded
- Sub: strapi

#### FEED/REGISTER

- Pub: embedded
- Sub: strapi

## Configuração Docker

<!---
* Setar permissões via chmod de tudo dentro de ./mosquitto
* Depois rodar:
    - sudo chown 1883:1883 mosquitto/config/pwfile
    - sudo chmod 0600 mosquitto/config/pwfile
    - chmod 0600 mosquitto/data/mosquitto.db
* Criar os usuários:
    - docker exec -it xanims-mqtt mosquitto_passwd -b /mosquitto/config/pwfile strapi strapi 
    - docker exec -it xanims-mqtt mosquitto_passwd -b /mosquitto/config/pwfile embedded embedded 
* Primeiro executar tudo via docker compose up --build
* Depois logar no container do broker mosquitto

* Ref: https://github.com/sukesh-ak/setup-mosquitto-with-docker
 !---> 