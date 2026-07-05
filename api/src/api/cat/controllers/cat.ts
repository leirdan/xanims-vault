/**
 * cat controller
 */

import { factories } from '@strapi/strapi';
import { generateDietForCat } from '../../../utils/diet';
import { publishDietSync } from '../../../utils/mqtt-client';

export default factories.createCoreController('api::cat.cat', ({ strapi }) => ({
  /**
   * Recalcula a dieta (porção + horários) de um gato a partir dos dados
   * atuais (peso, castrado, fase de vida) e, se o gato já tiver um NFC
   * vinculado, publica a nova dieta direto no tópico `cat/sync` do MQTT —
   * ou seja, o ESP recebe a atualização sem precisar de uma nova leitura
   * física da tag NFC.
   */
  async regenerateDiet(ctx) {
    const { id } = ctx.params;

    try {
      const { diet, hours, cat } = await generateDietForCat(strapi, id);

      let synced = false;
      if (cat.nfc) {
        await publishDietSync(strapi, cat.nfc, diet.portion, hours);
        synced = true;
      }

      ctx.body = {
        data: {
          diet,
          hours,
          synced,
          message: synced
            ? 'Dieta regenerada e enviada ao comedouro com sucesso.'
            : 'Dieta regenerada, mas o gato ainda não possui NFC vinculado — a dieta será enviada ao ESP na próxima leitura da tag.',
        },
      };
    } catch (err: any) {
      ctx.throw(400, err.message || 'Erro ao regenerar dieta.');
    }
  },
}));
