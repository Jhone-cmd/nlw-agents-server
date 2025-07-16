import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
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

app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  attachFieldsToBody: true,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NLW Agents API',
      description: 'Documentação da API NLW Agents',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
  mode: 'dynamic',
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(health);
app.register(getRooms);
app.register(createRoom);
app.register(getRoomQuestions);
app.register(createQuestion);
app.register(uploadAudio);

app.setErrorHandler(errorHandler);
