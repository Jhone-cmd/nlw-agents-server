import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

export const health: FastifyPluginCallbackZod = (app) => {
  app.get('/health', () => {
    return 'CHECK OK';
  });
};
