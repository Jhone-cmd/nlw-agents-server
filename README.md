# NLW Agents - Server

## Descrição

Esta aplicação é uma API backend para gerenciamento de salas de perguntas e respostas, com suporte a transcrição de áudio e busca semântica utilizando embeddings. Usuários podem criar salas, enviar perguntas, fazer upload de áudios para transcrição automática e obter respostas baseadas no conteúdo transcrito das aulas. Esse projeto foi desenvolvido no evento NLW Agents da RocketSeat.

## Requisitos Funcionais

- [x] Criar salas com nome e descrição.
- [x] Listar todas as salas existentes.
- [x] Criar perguntas associadas a uma sala.
- [x] Listar perguntas de uma sala específica.
- [x] Fazer upload de arquivos de áudio para uma sala.
- [x] Transcrever automaticamente o áudio enviado.
- [x] Gerar embeddings dos textos transcritos e das perguntas.
- [x] Buscar trechos relevantes do contexto para responder perguntas.
- [x] Retornar respostas baseadas apenas no conteúdo das transcrições.
- [x] Endpoint de health check para verificação de status da API.

## Regras de Negócio

- [x] Apenas perguntas com no mínimo 3 caracteres podem ser criadas.
- [x] O áudio enviado deve ser transcrito para português do Brasil, mantendo pontuação e parágrafos.
- [x] As respostas às perguntas devem ser baseadas exclusivamente no conteúdo transcrito da sala.
- [x] Caso não haja informação suficiente no contexto, a resposta deve indicar que não é possível responder.
- [x] Embeddings são utilizados para buscar similaridade entre perguntas e transcrições.
- [x] Cada chunk de áudio é associado a uma sala e armazenado com sua transcrição e embeddings.

## Bibliotecas Utilizadas

- [Fastify](https://www.fastify.dev/) - Framework web para Node.js.
- [fastify-type-provider-zod](https://github.com/SerayaElessar/fastify-type-provider-zod) - Integração do Zod com Fastify para validação de tipos.
- [Zod](https://zod.dev/) - Validação de esquemas e tipos.
- [Drizzle ORM](https://orm.drizzle.team/) - ORM para banco de dados PostgreSQL.
- [@google/genai](https://www.npmjs.com/package/@google/genai) - Integração com modelos Gemini para transcrição e embeddings.
- [pgvector](https://github.com/pgvector/pgvector) - Extensão PostgreSQL para armazenamento e busca de vetores.
- [postgres](https://github.com/porsager/postgres) - Cliente PostgreSQL para Node.js.
- [@fastify/cors](https://github.com/fastify/fastify-cors) - Middleware CORS para Fastify.
- [@fastify/multipart](https://github.com/fastify/fastify-multipart) - Suporte a uploads multipart.
- [@fastify/swagger](https://github.com/fastify/fastify-swagger) - Documentação automática dos endpoints da API.
- [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui) - Interface visual para documentação Swagger.

## Documentação da API (Swagger)

A documentação dos endpoints está disponível automaticamente via Swagger.

- **Acesse:** [http://localhost:3333/docs](http://localhost:3333/docs)
- **Descrição:** Todos os endpoints, parâmetros, respostas e exemplos podem ser consultados e testados diretamente pela interface Swagger UI.

## Como executar

1. Instale as dependências:
   ```sh
   npm install
   ```

2. Configure o arquivo `.env` com as variáveis:
   - `PORT`
   - `DATABASE_URL`
   - `GEMINI_API_KEY`

3. Suba o banco de dados PostgreSQL com suporte a pgvector:
   ```sh
   docker-compose up
   ```

4. Execute as migrações e seed:
   ```sh
   npm run db:migrate
   npm run db:seed
   ```

5. Inicie o servidor:
   ```sh
   npm run dev
   ```

## Endpoints principais

- `GET /health` — Health check da API.
- `GET /rooms` — Lista todas as salas.
- `POST /rooms` — Cria uma nova sala.
- `GET /rooms/:roomId/questions` — Lista perguntas de uma sala.
- `POST /rooms/:roomId/questions` — Cria uma pergunta em uma sala.
- `POST /rooms/:roomId/audio` — Faz upload de áudio para transcrição.

## Estrutura de pastas

Veja a estrutura detalhada no início deste README.

--------------------------------------------------------------------------
