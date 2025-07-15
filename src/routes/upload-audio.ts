import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { transcribeAudio } from '../services/gemini.ts';

export const uploadAudio: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, _) => {
      try {
        const { roomId } = request.params;
        const audio = await request.file();

        if (!audio) {
          throw new Error('Audio is required.');
        }

        const audioBuffer = await audio.toBuffer();
        const audioAsBase64 = audioBuffer.toString('base64');

        const transcription = await transcribeAudio(
          audioAsBase64,
          audio.mimetype
        );

        console.log(transcription);

        return 'ok';
      } catch (error) {
        console.warn(error);
      }
    }
  );
};
