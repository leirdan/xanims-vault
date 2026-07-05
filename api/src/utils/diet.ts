import type { Core } from "@strapi/strapi";

export const FEEDING_HOURS = ["08:00:00", "11:00:00", "14:00:00", "17:00:00", "19:00:00", "22:00:00"];

/**
 * Mesma fórmula usada originalmente no middleware de criação de gato:
 * RER (repouso) -> calorias diárias (RER * fator da fase de vida) ->
 * gramas por dia (calorias / kcal por grama da ração) -> porção por
 * refeição (gramas por dia / quantidade de horários).
 */
function calculatePortion(weight: number, lifeStageFactor: number, kcalPerGram: number, mealsPerDay: number) {
  const rer = 70 * Math.pow(weight, 0.75);
  const calories = rer * lifeStageFactor;
  const gramsPerDay = calories / kcalPerGram;
  return gramsPerDay / mealsPerDay;
}

/**
 * Cria (ou recria) a dieta e os horários de alimentação de um gato.
 *
 * Se o gato já tiver uma dieta cadastrada, ela (e seus horários) são
 * apagados antes de criar a nova, já que a relação `diet.cat` é 1:1 e não
 * deve sobrar registro órfão no banco toda vez que a dieta é regenerada.
 */
export async function generateDietForCat(strapi: Core.Strapi, catDocumentId: string) {
  const cat = await strapi.documents("api::cat.cat").findOne({
    documentId: catDocumentId,
    populate: ["life_stage_factor"],
  });

  if (!cat) {
    throw new Error("Gato não encontrado.");
  }
  if (!cat.life_stage_factor) {
    throw new Error("Gato não possui fase de vida cadastrada.");
  }

  let rationCategory = "adult";
  if (cat.neutered) rationCategory = "neutered";
  else if (cat.life_stage_factor.description === "Crescimento") rationCategory = "child";

  const ration = await strapi.documents("api::ration.ration").findFirst({
    filters: { category: rationCategory, brand: "Quatree" },
  });

  if (!ration) {
    throw new Error(`Nenhuma ração cadastrada para a categoria "${rationCategory}".`);
  }

  const previousDiet = await strapi.documents("api::diet.diet").findFirst({
    filters: { cat: { documentId: cat.documentId } },
  });

  if (previousDiet) {
    const previousSchedules = await strapi.documents("api::diet-schedule.diet-schedule").findMany({
      filters: { diet: { documentId: previousDiet.documentId } },
    });
    for (const schedule of previousSchedules) {
      await strapi.documents("api::diet-schedule.diet-schedule").delete({ documentId: schedule.documentId });
    }
    await strapi.documents("api::diet.diet").delete({ documentId: previousDiet.documentId });
  }

  const portion = calculatePortion(
    cat.weight,
    cat.life_stage_factor.factor,
    ration.kcal_per_gram,
    FEEDING_HOURS.length
  );

  const diet = await strapi.documents("api::diet.diet").create({
    data: {
      cat: cat.documentId,
      ration: ration.documentId,
      portion,
    },
    status: "published",
  });

  for (const hour of FEEDING_HOURS) {
    await strapi.documents("api::diet-schedule.diet-schedule").create({
      data: { diet: diet.documentId, hour },
      status: "published",
    });
  }

  return { diet, hours: FEEDING_HOURS, cat };
}

/**
 * Classifica uma leitura de consumo de acordo com a porção esperada da
 * dieta. Limiares: >=90% da porção -> completo, entre 0 e 90% -> parcial,
 * <=5g (praticamente nada) -> não consumiu.
 */
export function classifyConsumption(amount: number, expectedPortion: number): "completo" | "parcial" | "nao_consumiu" {
  if (amount <= 5) return "nao_consumiu";
  if (expectedPortion > 0 && amount >= 0.9 * expectedPortion) return "completo";
  return "parcial";
}

/**
 * Dado um horário (HH:MM:SS) e uma lista de diet-schedules, retorna o
 * schedule cujo horário está mais próximo — usado para associar uma
 * leitura de consumo (que chega com o horário real da pesagem) ao
 * horário de alimentação programado mais provável.
 */
type ScheduleLike = { documentId: string; hour?: string | Date | null };

export function findClosestSchedule<T extends ScheduleLike>(schedules: T[], atTime: Date): T | null {
  if (schedules.length === 0) return null;

  const targetMinutes = atTime.getHours() * 60 + atTime.getMinutes();

  let closest = schedules[0];
  let smallestDiff = Infinity;

  for (const schedule of schedules) {
    if (!schedule.hour) continue;
    const [h, m] = schedule.hour.toString().split(":").map(Number);
    const scheduleMinutes = h * 60 + m;
    const diff = Math.min(
      Math.abs(scheduleMinutes - targetMinutes),
      1440 - Math.abs(scheduleMinutes - targetMinutes)
    );
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = schedule;
    }
  }

  return closest;
}
