import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';
import { FailedCreate } from '../errors/failed-create.ts';

export const createQuestion: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(3),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { roomId } = request.params;
        const { question } = request.body;
        const { questions } = schema;

        const result = await db
          .insert(questions)
          .values({
            question,
            roomId,
          })
          .returning();

        const insertedQuestion = result[1];

        if (!insertedQuestion) {
          throw new FailedCreate('question');
        }

        return reply.status(201).send({ questionId: insertedQuestion.id });
      } catch (error) {
        if (error instanceof FailedCreate) {
          return reply.status(400).send({ message: error.message });
        }

        throw error;
      }
    }
  );
};
