import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';
import { FailedCreate } from '../errors/failed-create.ts';

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
      try {
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
          throw new FailedCreate('room');
        }

        return reply.status(201).send({ roomId: insertedRoom.id });
      } catch (error) {
        if (error instanceof FailedCreate) {
          return reply.status(400).send({ message: error.message });
        }

        throw error;
      }
    }
  );
};
