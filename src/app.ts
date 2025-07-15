import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { errorHandler } from './error-handler.ts';
import { createQuestion } from './routes/create-question.ts';
import { createRoom } from './routes/create-room.ts';
import { getRoomQuestions } from './routes/get-room-questions.ts';
import { getRooms } from './routes/get-rooms.ts';
import { health } from './routes/health.ts';
import { uploadAudio } from './routes/upload-audio.ts';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(cors, {
  origin: 'http://localhost:5173',
});

app.register(multipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(health);
app.register(getRooms);
app.register(createRoom);
app.register(getRoomQuestions);
app.register(createQuestion);
app.register(uploadAudio);

app.setErrorHandler(errorHandler);
