export const config = {
  db: {
    filename: 'chat.db',
  },
  server: {
    port: 4000,
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  },
};

export type Config = typeof config;
