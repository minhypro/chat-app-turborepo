import { createServer } from 'node:http';
import { createApp, logger } from './create-app';
import { config } from './config';

const httpServer = createServer();

const { close } = await createApp(httpServer, config);

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received');

  await close();
});

httpServer.listen(config.server.port, () => {
  logger.info(`Server running at http://localhost:${config.server.port}`);
});
