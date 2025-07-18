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
  transform: (data) => {
    const { schema, url } = jsonSchemaTransform(data);

    if (schema.consumes?.includes('multipart/form-data')) {
      if (schema.body === undefined) {
        schema.body = {
          type: 'object',
          required: [],
          properties: {},
        };
      }

      // @ts-expect-error
      schema.body.properties.file = {
        type: 'string',
        format: 'binary',
      };

      // @ts-expect-error
      schema.body.required?.push('file');
    }

    return { schema, url };
  },
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
