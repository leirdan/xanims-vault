import { Core } from "@strapi/strapi";
import { ApiCatCat } from "../types/generated/contentTypes";
import ration from "./api/ration/controllers/ration";

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
            else if (catEntity.life_stage_factor?.description === "growth") rationCategory = "child";

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
