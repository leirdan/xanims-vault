export async function afterCreate(event) {
module.exports = {
  async generate(catId) {
    try {

    const cat = await strapi.entityService.findOne(
      'api::cat.cat',
      catId,
      {
        populate: ['lifeStageFactor'],
      }
    );

    let category;

    if (cat.neutered) {
      category = 'neutered';
    } else if (
      cat.lifeStageFactor.description === 'growth'
    ) {
      category = 'child';
    } else {
      category = 'adult';
    }

    const rations = await strapi.entityService.findMany(
      'api::ration.ration',
      {
        filters: {
          category,
          brand: 'Quatree',
        },
      }
    );

    const ration = rations[0];

    const rer =
      70 * Math.pow(cat.weight, 0.75);

    const calories =
      rer * cat.lifeStageFactor.factor;

    const gramsPerDay =
      calories / ration.kcal_per_gram;

    const mealsPerDay = 6;

    const portion =
      gramsPerDay / mealsPerDay;

    const diet =
      await strapi.entityService.create(
        'api::diet.diet',
        {
          data: {
            cat: cat.id,
            ration: ration.id,
            portion,
          },
        }
      );

    const hours = ['07:00', '09:00', '12:00', '14:00', '17:00', '20:00'];

    for (const hour of hours) {
      await strapi.entityService.create(
        'api::diet-schedule.diet-schedule',
        {
          data: {
            diet: diet.id,
            hour,
          },
        }
      );
    }

    return diet;
  } catch (ex) {
    strapi.log.error(ex);
  }
}
    
}
}