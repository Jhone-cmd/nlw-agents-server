import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const health: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        description: 'Endpoint to check the health of the API',
        response: {
          200: z.string(),
        },
      },
    },
    () => {
      return 'CHECK OK';
    }
  );
};
