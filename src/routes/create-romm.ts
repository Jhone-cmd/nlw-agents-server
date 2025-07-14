import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';

export const createRoom: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms',
    {
      schema: {
        body: z.object({
          name: z.string().min(5),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { name, description } = request.body;
      const { rooms } = schema;
      const result = await db
        .insert(rooms)
        .values({
          name,
          description,
        })
        .returning();

      const insertedRoom = result[0];

      if (!insertedRoom) {
        throw new Error('Failed create a new room.');
      }

      reply.status(201).send({ roomId: insertedRoom.id });
    }
  );
};
