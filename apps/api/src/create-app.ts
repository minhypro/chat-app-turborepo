import express, { Request, Response } from 'express';
import { Server as HttpServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server as SocketServer, Socket } from 'socket.io';

import cors from 'cors';
import { initDb } from './db';
import { Config } from './config';
import { userServices } from './services/user';
import { ChatDatabase } from './global.type';
import { channelRoom, getUsernameFromSocket, logger, userRoom } from './utils';
import { channelServices } from './services/chat';
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

    const userId = await userServices.connect(db, username);
    socket.handshake.auth.userId = userId;

    try {
      const chats = await userServices.fetchUserChats(db, userId!);

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
    socket.on('channel:create', channelServices.createChannel({ io, socket, db }));
    // socket.on("channel:join", joinChannel({ io, socket, db }));
    // socket.on("channel:list", listChannels({ io, socket, db }));
    // socket.on("channel:search", searchChannels({ io, socket, db }));

    // socket.on("user:get", getUser({ io, socket, db }));
    // socket.on("user:reach", reachUser({ io, socket, db }));
    // socket.on("user:search", searchUsers({ io, socket, db }));

    socket.on('message:send', messageServices.sendMessage({ io, socket, db }));
    // socket.on("message:list", listMessages({ io, socket, db }));
    // socket.on("message:ack", ackMessage({ io, socket, db }));
    // socket.on("message:typing", typingMessage({ io, socket, db }));

    socket.on('disconnect', async () => {
      await userServices.disconnect(db, socket.handshake.auth.userId);
    });

    socket.on('clear chat', async () => {
      try {
        await db.run('DELETE FROM messages');
      } catch (e) {
        console.error('Failed to clear chat:', e);
        return;
      }
      io.emit('chat cleared');
    });

    socket.on('chat message', async (msg: string) => {
      console.log(msg);
      // let result;
      // try {
      //   // Store the message in the database
      //   result = await db.run("INSERT INTO messages (content) VALUES (?)", msg);
      // } catch (e) {
      //   console.error("Failed to store chat message:", e);
      //   return;
      // }
      // // Include the offset with the message
      // io.to(userRoom(username)).emit('chat message', msg, '123');
    });

    if (!socket.recovered) {
      // If the connection state recovery was not successful
      // try {
      //   await db.each(
      //     "SELECT id, content FROM messages WHERE id > ?",
      //     [socket.handshake.auth.serverOffset || 0],
      //     (_err: Error | null, row: { id: number; content: string }) => {
      //       socket.emit("chat message", row.content, row.id);
      //     }
      //   );
      // } catch (e) {
      //   console.error("Failed to recover messages:", e);
      // }
    }
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
