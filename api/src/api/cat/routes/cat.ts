import { factories } from "@strapi/strapi";

const defaultRouter = factories.createCoreRouter("api::cat.cat");

export default {
  get routes() {
    return [
      ...(Array.isArray(defaultRouter.routes)
        ? defaultRouter.routes
        : defaultRouter.routes()),

      {
        method: "POST",
        path: "/cats/:id/regenerate-diet",
        handler: "api::cat.cat.regenerateDiet",
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ];
  },
};