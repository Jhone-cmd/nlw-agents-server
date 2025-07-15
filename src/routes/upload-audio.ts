import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';

export const uploadAudio: FastifyPluginCallbackZod = (app) => {
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
    async (request, _) => {
      try {
        const { roomId } = request.params;
        const audio = await request.file();

        if (!audio) {
          throw new Error('Audio is required.');
        }

        const audioBuffer = await audio.toBuffer();
        const audioAsBase64 = audioBuffer.toString('base64');

        return audioAsBase64;
      } catch (error) {
        console.warn(error);
      }
    }
  );
};
