import express, { Request, Response } from 'express';
import { Server as HttpServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server as SocketServer, Socket } from 'socket.io';
import { EventName } from '@repo/types';

import cors from 'cors';
import { initDb } from './db';
import { Config } from './config';
import { userConnect, userDisconnect, fetchUserChats, getUser } from './services/user';
import { ChatDatabase } from './global.type';
import { channelRoom, getUsernameFromSocket, logger, userRoom } from './utils';
import { createChat, joinChat, listChats } from './services/chat';
import { messageServices } from './services/message';

export async function createApp(httpServer: HttpServer, config: Config) {
  const app = createExpressApp();
  httpServer.on('request', app);

  if (config.server.cors) {
    app.use(cors(config.server.cors));
  }

  const io = new SocketServer(httpServer, {
    cors: config.server.cors,
    connectionStateRecovery: {},
  });

  const db = await initDb();

  initEventHandlers(io, db);

  return {
    async close() {
      io.close();
      await db.close();
    },
  };
}

export { logger };

const initEventHandlers = (io: SocketServer, db: ChatDatabase) => {
  io.use(async (socket, next) => {
    const username = getUsernameFromSocket(socket);

    const userId = await userConnect(db, username);
    socket.handshake.auth.userId = userId;

    try {
      const chats = await fetchUserChats(db, userId!);

      logger.info('User connected: %s chats: %j', username, chats);

      chats?.length &&
        chats.forEach(chat => {
          socket.join(channelRoom(chat.id));
        });

      socket.join(userRoom(userId!));
      return next();
    } catch (e) {
      return next(new Error('something went wrong'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    socket.on(EventName.CREATE_CHAT, createChat({ io, socket, db }));
    socket.on(EventName.JOIN_CHAT, joinChat({ io, socket, db }));
    socket.on(EventName.LIST_CHAT, listChats({ io, socket, db }));
    // socket.on("channel:search", searchChannels({ io, socket, db }));

    socket.on('user:get', getUser({ io, socket, db }));
    // socket.on("user:reach", reachUser({ io, socket, db }));
    // socket.on("user:search", searchUsers({ io, socket, db }));

    socket.on('message:send', messageServices.sendMessage({ io, socket, db }));
    // socket.on("message:list", listMessages({ io, socket, db }));
    // socket.on("message:ack", ackMessage({ io, socket, db }));
    // socket.on("message:typing", typingMessage({ io, socket, db }));

    socket.on('disconnect', async () => {
      await userDisconnect(db, socket.handshake.auth.userId);
    });
  });
};

const createExpressApp = () => {
  const app = express();

  app.set('etag', false);
  app.set('x-powered-by', false);

  const __dirname = dirname(fileURLToPath(import.meta.url));

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  app.get('/user2', (req: Request, res: Response) => {
    res.sendFile(join(__dirname, 'user2.html'));
  });

  return app;
};
