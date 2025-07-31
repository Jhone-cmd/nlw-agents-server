import { and, eq, sql } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';
import { FailedCreate } from '../errors/failed-create.ts';
import { generateAnswer, generateEmbeddings } from '../services/gemini.ts';

export const createQuestion: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        tags: ['Questions'],
        description: 'Create a new question in a room',
        summary: 'Create Question',
        params: z.object({
          roomId: z.uuidv4(),
        }),
        body: z.object({
          question: z.string().min(3),
        }),
        response: {
          201: z.object({
            questionId: z.string(),
            answer: z.string().nullable(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
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

        let answer: string | null = null;

        if (chunks.length > 0) {
          const transcriptions = chunks.map((chunk) => chunk.transcription);

          answer = await generateAnswer(question, transcriptions);
        }

        const result = await db
          .insert(questions)
          .values({
            roomId,
            question,
            answer,
          })
          .returning();

        const insertedQuestion = result[0];

        if (!insertedQuestion) {
          throw new FailedCreate('question');
        }

        return reply
          .status(201)
          .send({ questionId: insertedQuestion.id, answer });
      } catch (error) {
        if (error instanceof FailedCreate) {
          return reply.status(400).send({ message: error.message });
        }

        throw error;
      }
    }
  );
};
