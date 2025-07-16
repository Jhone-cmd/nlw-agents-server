import { desc, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';

export const getRoomQuestions: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId/questions',
    {
      schema: {
        tags: ['Questions'],
        description: 'Get all questions in a room',
        summary: 'Get Room Questions',
        params: z.object({
          roomId: z.uuid(),
        }),
        response: {
          200: z.object({
            results: z.array(
              z.object({
                id: z.string(),
                question: z.string(),
                answer: z.string().nullable(),
                createdAt: z.string().datetime(),
              })
            ),
          }),
        },
      },
    },
    async (request, _) => {
      try {
        const { roomId } = request.params;
        const { questions } = schema;

        const dbResults = await db
          .select({
            id: questions.id,
            question: questions.question,
            answer: questions.answer,
            createdAt: questions.createdAt,
          })
          .from(questions)
          .where(eq(questions.roomId, roomId))
          .orderBy(desc(questions.createdAt));

        const results = dbResults.map((q) => ({
          ...q,
          createdAt:
            q.createdAt instanceof Date
              ? q.createdAt.toISOString()
              : q.createdAt,
        }));

        return { results };
      } catch (error) {
        console.warn(error);
      }
    }
  );
};
