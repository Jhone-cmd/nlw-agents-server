import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';
import { FailedCreate } from '../errors/failed-create.ts';
import { generateEmbeddings, transcribeAudio } from '../services/gemini.ts';

export const uploadAudio: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        tags: ['Audio'],
        description: 'Upload audio file for a room',
        summary: 'Upload Audio',
        consumes: ['multipart/form-data'],
        body: z.object({
          audio_file: z.instanceof(Buffer).optional(),
        }),
        params: z.object({
          roomId: z.uuid(),
        }),
        response: {
          201: z.object({
            audio_chunk: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { audioChunks } = schema;
        const { roomId } = request.params;
        const audio = await request.file();
        if (!audio) {
          return reply.status(400).send({ message: 'Audio file is required.' });
        }

        if (!roomId) {
          throw new Error('Room ID is required.');
        }

        const audioBuffer = await audio.toBuffer();
        const audioAsBase64 = audioBuffer.toString('base64');

        const transcription = await transcribeAudio(
          audioAsBase64,
          audio.mimetype
        );

        const embeddings = await generateEmbeddings(transcription);

        const result = await db
          .insert(audioChunks)
          .values({
            roomId,
            transcription,
            embeddings,
          })
          .returning();

        const chunk = result[0];

        if (!chunk) {
          throw new FailedCreate('audio chunk');
        }

        return reply.status(201).send({ audio_chunk: chunk.id });
      } catch (error) {
        console.log(error);

        if (error instanceof FailedCreate) {
          return reply.status(400).send({ message: error.message });
        }

        throw error;
      }
    }
  );
};
