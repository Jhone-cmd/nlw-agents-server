import cors from '@fastify/cors';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(cors, {
  origin: 'http://localhost:5173',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
  return 'OK';
});
