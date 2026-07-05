/**
 * Cliente MQTT único da aplicação.
 *
 * Antes, a conexão MQTT era criada e usada apenas dentro do `bootstrap` em
 * `src/index.ts`, então nenhum outro lugar do backend (ex: um controller
 * customizado) conseguia publicar mensagens. Esse módulo centraliza a
 * conexão para que qualquer parte do Strapi (controllers, services, o
 * próprio bootstrap) consiga publicar/assinar tópicos usando o mesmo
 * client.
 */

import mqtt, { MqttClient } from "mqtt";
import type { Core } from "@strapi/strapi";

let client: MqttClient | null = null;

export function connectMqtt(strapi: Core.Strapi): MqttClient {
  if (client) return client;

  client = mqtt.connect("mqtt://mqtt:1883", {
    username: "strapi",
    password: "strapi",
    clientId: "strapi_" + Math.random().toString(16).substring(2, 8),
  });

  client.on("connect", () => {
    strapi.log.info("Conectado ao broker MQTT!");
  });

  client.on("error", (err) => {
    strapi.log.error("Erro na conexão MQTT.", err);
  });

  return client;
}

export function getMqttClient(): MqttClient {
  if (!client) {
    throw new Error(
      "Cliente MQTT ainda não foi inicializado. connectMqtt(strapi) precisa ser chamado no bootstrap antes de qualquer publish."
    );
  }
  return client;
}

/**
 * Publica a dieta atual de um gato no tópico `cat/sync`, que é o mesmo
 * payload que o ESP recebe hoje quando lê a tag NFC. Usado tanto pelo fluxo
 * antigo (leitura de NFC) quanto pelo novo endpoint de regenerar dieta, que
 * envia a dieta direto pro ESP sem precisar de leitura física da tag.
 */
export function publishDietSync(
  strapi: Core.Strapi,
  nfc: string,
  portion: number,
  hours: string[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const mqttClient = getMqttClient();
    const payload = JSON.stringify({ nfc, portion, hours });
    mqttClient.publish("cat/sync", payload, (err) => {
      if (err) {
        strapi.log.error("Falha ao publicar payload de sincronização.", err);
        reject(err);
        return;
      }
      strapi.log.info(`Payload de sincronização enviado ao embarcado: ${payload}`);
      resolve();
    });
  });
}
