import { count, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';

const roomSchema = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.date(),
      questionsCount: z.number(),
    })
  ),
});

export const getRooms: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms',
    {
      schema: {
        tags: ['Rooms'],
        summary: 'Get all rooms',
        description:
          'Fetches all rooms with their creation date and question count.',
        response: {
          200: roomSchema,
        },
      },
    },
    async () => {
      const { rooms, questions } = schema;

      const results = await db
        .select({
          id: rooms.id,
          name: rooms.name,
          createdAt: rooms.createdAt,
          questionsCount: count(questions.id),
        })
        .from(rooms)
        .leftJoin(questions, eq(questions.roomId, rooms.id))
        .groupBy(rooms.id)
        .orderBy(rooms.createdAt);

      return { results };
    }
  );
};
