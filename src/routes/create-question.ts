import { and, eq, sql } from 'drizzle-orm';
import { vector } from 'drizzle-orm/pg-core';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';
import { FailedCreate } from '../errors/failed-create.ts';
import { generateEmbeddings } from '../services/gemini.ts';

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
        const { questions, audioChunks } = schema;

        const embeddings = await generateEmbeddings(question);

        const embeddingsAsString = `[${embeddings.join(',')}]`;

        const chunks = await db
          .select({
            id: audioChunks.id,
            transcription: audioChunks.transcription,
            similarity: sql<number>`1 - (${audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
          })
          .from(audioChunks)
          .where(
            and(
              eq(audioChunks.roomId, roomId),
              sql`1 - (${audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.8`
            )
          )
          .orderBy(
            sql`1 - (${audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`
          )
          .limit(5);

        // const result = await db
        //   .insert(questions)
        //   .values({
        //     question,
        //     roomId,
        //   })
        //   .returning();

        // const insertedQuestion = result[0];

        // if (!insertedQuestion) {
        //   throw new FailedCreate('question');
        // }

        // return reply.status(201).send({ questionId: insertedQuestion.id });
        return chunks;
      } catch (error) {
        if (error instanceof FailedCreate) {
          return reply.status(400).send({ message: error.message });
        }

        throw error;
      }
    }
  );
};
