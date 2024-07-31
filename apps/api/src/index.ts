import express, { Request, Response } from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server, Socket } from "socket.io";

import cors from "cors";
import { initDb } from "./db";
import { config } from "./config";
import { userServices } from "./services/user";
import { ChatDatabase } from "./global.type";
import { channelRoom, userRoom } from "./utils";
import { channelServices } from "./services/channel";

const initEventHandlers = (io: Server, db: ChatDatabase) => {
  io.use(async (socket, next) => {
    const { name } = socket.handshake.auth;
    await userServices.connect(db, name);

    let channels;

    try {
      channels = await userServices.fetchUserChannels(db, name);
    } catch (e) {
      return next(new Error("something went wrong"));
    }

    channels?.length &&
      channels.forEach((channelId) => {
        socket.join(channelRoom(channelId));
      });

    socket.join(userRoom(name));

    next();
  });
};

// Main application

(async () => {
  // Open the database
  const db = await initDb();

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: config.server.cors,
    connectionStateRecovery: {},
  });

  app.use(cors(config.server.cors));

  const __dirname = dirname(fileURLToPath(import.meta.url));

  app.get("/", (req: Request, res: Response) => {
    res.sendFile(join(__dirname, "index.html"));
  });

  app.get("/user2", (req: Request, res: Response) => {
    res.sendFile(join(__dirname, "user2.html"));
  });

  initEventHandlers(io, db);

  io.on("connection", async (socket: Socket) => {
    const { name } = socket.handshake.auth;

    socket.on(
      "channel:create",
      channelServices.createChannel({ io, socket, db })
    );
    // socket.on("channel:join", joinChannel({ io, socket, db }));
    // socket.on("channel:list", listChannels({ io, socket, db }));
    // socket.on("channel:search", searchChannels({ io, socket, db }));

    // socket.on("user:get", getUser({ io, socket, db }));
    // socket.on("user:reach", reachUser({ io, socket, db }));
    // socket.on("user:search", searchUsers({ io, socket, db }));

    // socket.on("message:send", sendMessage({ io, socket, db }));
    // socket.on("message:list", listMessages({ io, socket, db }));
    // socket.on("message:ack", ackMessage({ io, socket, db }));
    // socket.on("message:typing", typingMessage({ io, socket, db }));

    socket.on("disconnect", async () => {
      await userServices.disconnect(db, name);
    });

    socket.on("clear chat", async () => {
      try {
        await db.run("DELETE FROM messages");
      } catch (e) {
        console.error("Failed to clear chat:", e);
        return;
      }
      io.emit("chat cleared");
    });

    socket.on("chat message", async (msg: string) => {
      console.log(msg);
      let result;
      // try {
      //   // Store the message in the database
      //   result = await db.run("INSERT INTO messages (content) VALUES (?)", msg);
      // } catch (e) {
      //   console.error("Failed to store chat message:", e);
      //   return;
      // }
      // // Include the offset with the message
      io.to(userRoom(name)).emit("chat message", msg, "123");
    });

    if (!socket.recovered) {
      // If the connection state recovery was not successful
      try {
        await db.each(
          "SELECT id, content FROM messages WHERE id > ?",
          [socket.handshake.auth.serverOffset || 0],
          (_err: Error | null, row: { id: number; content: string }) => {
            socket.emit("chat message", row.content, row.id);
          }
        );
      } catch (e) {
        console.error("Failed to recover messages:", e);
      }
    }
  });

  server.listen(config.server.port, () => {
    console.log(`Server running at http://localhost:${config.server.port}`);
  });
})();
