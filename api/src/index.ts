import { Core } from "@strapi/strapi";
import mqtt from "mqtt";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const mqttClient = mqtt.connect('mqtt://mqtt:1883', {
      username: 'strapi',
      password: 'strapi',
      clientId: 'strapi_' + Math.random().toString(16).substring(2, 8),
    });

    mqttClient.on('connect', () => {
      strapi.log.info('Conectado ao broker MQTT!');
      mqttClient.subscribe('cat/nfc', (ok) => {
        if (ok) strapi.log.info('Inscrição em cat/nfc feita com sucesso');
      });
      mqttClient.subscribe('cat/intruder', (ok) => {
        if (ok) strapi.log.info('Inscrição em cat/intruder feita com sucesso');
      });
      mqttClient.subscribe('feed/register', (ok) => {
        if (ok) strapi.log.info('Inscrição em feed/register feita com sucesso');
      });
    });

    mqttClient.on('error', (err) => {
      strapi.log.error('Erro na conexão MQTT.', err);
    });

    mqttClient.on('message', async (topic, message) => {
      strapi.log.info(`Dados recebidos em [${topic}]: ${message.toString()}`);

      switch (topic) {

        case "cat/nfc": {
          try {
            const payload = JSON.parse(message.toString());
            const nfc = payload.nfc;
            if (!nfc) {
              strapi.log.error("NFC do gato não veio.");
              return;
            }
            const cats = await strapi.documents('api::cat.cat').findMany({
              sort: 'createdAt:desc',
              limit: 1,
            });

            const cat = cats.length > 0 ? cats[0] : null;

            if (!cat) {
              strapi.log.error("Nenhum gato foi encontrado no sistema.");
              return;
            }

            const diet = await strapi.documents('api::diet.diet').findFirst({
              filters: {
                cat: {
                  documentId: cat.documentId
                }
              }
            })

            if (!diet) {
              strapi.log.error("Nenhuma dieta foi cadastrada para o gato.")
              return;
            }

            const schedule = await strapi.documents("api::diet-schedule.diet-schedule").findMany({
              filters:
              {
                diet: { documentId: diet.documentId }
              }
            })

            if (schedule.length == 0) {
              strapi.log.error("Nenhum horário de alimentação foi cadastrado para o gato.")
              return;
            }
            const hours = schedule.map(s => s.hour.toString())

            await strapi.documents('api::cat.cat').update({
              documentId: cat.documentId,
              data: {
                nfc: nfc,
              }
            });

            // TODO: ver se o gato já tem NFC e tratar isso?

            const syncPayload = JSON.stringify({ nfc, portion: diet.portion, hours })
            strapi.log.info(`Sync payload: ${syncPayload}`)
            mqttClient.publish('cat/sync', syncPayload, () => {
              strapi.log.info("Payload de sincronização enviado ao embarcado.")
            })
          break;
          }
          catch (err) { 
          break;
          }
        }

        // TODO: elaborar os outros tópicos
        default:
          strapi.log.error("Tópico não reconhecido.")
          break;
      }
    });

    strapi.documents.use((ctx, next) => {
      if (ctx.uid === 'api::cat.cat' && ctx.action === 'create') {
        return next().then(async (res) => {
          try {
            const catEntity = await strapi.documents("api::cat.cat").findOne({
              documentId: res.documentId,
              populate: ["life_stage_factor"]
            })

            let rationCategory = "adult";
            if (catEntity.neutered) rationCategory = "neutered";
            else if (catEntity.life_stage_factor?.description === "Crescimento") rationCategory = "child";

            const rationEntity = await strapi.documents("api::ration.ration").findFirst({
              filters: {
                category: rationCategory,
                brand: "Quatree"
              }
            })

            const rer =
              70 * Math.pow(catEntity.weight, 0.75);
            const calories =
              rer * catEntity.life_stage_factor?.factor;
            const gramsPerDay =
              calories / rationEntity.kcal_per_gram;
            const hours = ['08:00:00', '11:00:00', '14:00:00', '17:00:00', '19:00:00', '22:00:00'];
            const portion =
              gramsPerDay / hours.length;

            const dietEntity = await strapi.documents("api::diet.diet").create({
              data: {
                cat: catEntity.documentId,
                ration: rationEntity.documentId,
                portion: portion
              },
              status: 'published',
            })

            for (const h of hours) {
              const schedule = await strapi.documents("api::diet-schedule.diet-schedule").create({
                data:
                {
                  diet: dietEntity.documentId,
                  hour: h
                },
                status: 'published',
              })
            }
            console.log("Dieta gerada com sucesso para o gato!")
          } catch (err) {
            console.log(err)
          }

          return res;
        })
      }

      return next();
    })


  },
};
