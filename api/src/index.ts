import { Core } from "@strapi/strapi";
import { connectMqtt } from "./utils/mqtt-client";
import { generateDietForCat, classifyConsumption, findClosestSchedule } from "./utils/diet";

const CONSUMPTION_TYPES = ["Completo", "Parcial", "Não consumiu"];

async function seedConsumptionTypes(strapi: Core.Strapi) {
  for (const description of CONSUMPTION_TYPES) {
    const existing = await strapi.documents("api::consumption-type.consumption-type").findFirst({
      filters: { description },
    });
    if (!existing) {
      await strapi.documents("api::consumption-type.consumption-type").create({
        data: { description },
        status: "published",
      });
      strapi.log.info(`Tipo de consumo "${description}" criado.`);
    }
  }
}

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
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedConsumptionTypes(strapi);

    const mqttClient = connectMqtt(strapi);

    mqttClient.on("connect", () => {
      mqttClient.subscribe("cat/nfc", (ok) => {
        if (ok) strapi.log.info("Inscrição em cat/nfc feita com sucesso");
      });
      mqttClient.subscribe("cat/intruder", (ok) => {
        if (ok) strapi.log.info("Inscrição em cat/intruder feita com sucesso");
      });
      mqttClient.subscribe("feed/register", (ok) => {
        if (ok) strapi.log.info("Inscrição em feed/register feita com sucesso");
      });
    });

    mqttClient.on("message", async (topic, message) => {
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
            const cats = await strapi.documents("api::cat.cat").findMany({
              sort: "createdAt:desc",
              limit: 1,
            });

            const cat = cats.length > 0 ? cats[0] : null;

            if (!cat) {
              strapi.log.error("Nenhum gato foi encontrado no sistema.");
              return;
            }

            const diet = await strapi.documents("api::diet.diet").findFirst({
              filters: {
                cat: {
                  documentId: cat.documentId,
                },
              },
            });

            if (!diet) {
              strapi.log.error("Nenhuma dieta foi cadastrada para o gato.");
              return;
            }

            const schedule = await strapi.documents("api::diet-schedule.diet-schedule").findMany({
              filters: {
                diet: { documentId: diet.documentId },
              },
            });

            if (schedule.length == 0) {
              strapi.log.error("Nenhum horário de alimentação foi cadastrado para o gato.");
              return;
            }
            const hours = schedule.map((s) => s.hour.toString());

            await strapi.documents("api::cat.cat").update({
              documentId: cat.documentId,
              data: {
                nfc: nfc,
              },
            });

            // TODO: ver se o gato já tem NFC e tratar isso?

            const syncPayload = JSON.stringify({ nfc, portion: diet.portion, hours });
            strapi.log.info(`Sync payload: ${syncPayload}`);
            mqttClient.publish("cat/sync", syncPayload, () => {
              strapi.log.info("Payload de sincronização enviado ao embarcado.");
            });
            break;
          } catch (err) {
            break;
          }
        }

        case "cat/intruder": {
          try {
            const payload = JSON.parse(message.toString());
            const nfc = payload.nfc;
            const intruder = payload.intruder;
            const date = payload.date;
            if (!nfc) {
              strapi.log.error("NFC do gato não veio.");
              return;
            }

            const cat = await strapi.documents("api::cat.cat").findFirst({ filters: { nfc: nfc } });
            const intrusion_alert = await strapi.documents("api::intrusion-alert.intrusion-alert").create({
              data: {
                cat: cat,
                intruder_nfc: intruder,
                date: date,
              },
              status: "published",
            });

            strapi.log.info(intrusion_alert);
            strapi.log.info("Alerta de intrusão criado com sucesso.");

            break;
          } catch (err) {
            strapi.log.error("Alerta de intrusão não foi criado. ");
            strapi.log.error(err);
            break;
          }
        }

        // Recebe as leituras do comedouro (peso restante/consumido) enviadas
        // pelo ESP após uma refeição e registra um Consumption classificado
        // como completo, parcial ou "não consumiu".
        case "feed/register": {
          try {
            const payload = JSON.parse(message.toString());
            const nfc = payload.nfc;
            const amount = Number(payload.amount);
            const timestamp = payload.date ? new Date(payload.date) : new Date();

            if (!nfc || Number.isNaN(amount)) {
              strapi.log.error("Payload de feed/register incompleto (nfc/amount).");
              return;
            }

            const cat = await strapi.documents("api::cat.cat").findFirst({ filters: { nfc } });
            if (!cat) {
              strapi.log.error(`Nenhum gato encontrado com o NFC ${nfc}.`);
              return;
            }

            const diet = await strapi.documents("api::diet.diet").findFirst({
              filters: { cat: { documentId: cat.documentId } },
            });
            if (!diet) {
              strapi.log.error("Gato não possui dieta cadastrada, consumo não pôde ser classificado.");
              return;
            }

            const schedules = await strapi.documents("api::diet-schedule.diet-schedule").findMany({
              filters: { diet: { documentId: diet.documentId } },
            });
            const closestSchedule = findClosestSchedule(schedules, timestamp);

            const classification = classifyConsumption(amount, diet.portion);
            const typeDescription =
              classification === "completo" ? "Completo" : classification === "parcial" ? "Parcial" : "Não consumiu";

            const consumptionType = await strapi.documents("api::consumption-type.consumption-type").findFirst({
              filters: { description: typeDescription },
            });

            await strapi.documents("api::consumption.consumption").create({
              data: {
                cat: cat.documentId,
                diet_schedule: closestSchedule?.documentId,
                consumption_type: consumptionType?.documentId,
                amount,
              },
              status: "published",
            });

            strapi.log.info(`Consumo de ${amount}g (${typeDescription}) registrado para o gato ${cat.name}.`);
            break;
          } catch (err) {
            strapi.log.error("Falha ao registrar consumo.");
            strapi.log.error(err);
            break;
          }
        }

        default:
          strapi.log.error("Tópico não reconhecido.");
          break;
      }
    });

    strapi.documents.use((ctx, next) => {
      if (ctx.uid === "api::cat.cat" && ctx.action === "create") {
        return next().then(async (res) => {
          try {
            await generateDietForCat(strapi, res.documentId);
            strapi.log.info("Dieta gerada com sucesso para o gato!");
          } catch (err) {
            strapi.log.error(err);
          }

          return res;
        });
      }

      return next();
    });
  },
};
