// tsup.config.js
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/app.ts',
    'src/env.ts',
    'src/error-handler.ts',
    'src/server.ts',
    'src/db/connection.ts',
    'src/db/seed.ts',
    'src/routes/create-question.ts',
    'src/routes/create-room.ts',
    'src/routes/get-room-questions.ts',
    'src/routes/get-rooms.ts',
    'src/routes/health.ts',
    'src/routes/upload-audio.ts',
    'src/services/gemini.ts',
    'src/errors/failed-create.ts',
    'src/db/schema/audio-chunks.ts',
    'src/db/schema/index.ts',
    'src/db/schema/questions.ts',
    'src/db/schema/rooms.ts',
  ],
  format: ['esm'],
  outDir: 'dist',
  external: ['drizzle-seed'], // Marcar drizzle-seed como externo
  // ... outras opções
});
