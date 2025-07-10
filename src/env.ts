import z from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
