import type { FastifyInstance } from 'fastify';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error.validation) {
    return reply.status(400).send({
      message: 'Validation Error',
      error: error.message,
    });
  }

  console.error(error);
  return reply.status(500).send({ message: 'Internal Server Error' });
};
