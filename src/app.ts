import cors from '@fastify/cors';
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

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(cors, {
  origin: 'http://localhost:5173',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(health);
app.register(getRooms);
app.register(createRoom);
app.register(getRoomQuestions);
app.register(createQuestion);

app.setErrorHandler(errorHandler);
