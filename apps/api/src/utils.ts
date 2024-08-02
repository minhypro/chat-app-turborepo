import { createLogger, transports, format } from "winston";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Socket } from "socket.io";

const ajv = new Ajv({
  useDefaults: true,
});

addFormats(ajv);

export { ajv };

export const logger = createLogger({
  level: "info",
  format: format.combine(format.splat(), format.simple()),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console());
}

export function channelRoom(channelId: string) {
  return `channel:${channelId}`;
}

export function userRoom(userId: string) {
  return `user:${userId}`;
}

export function userStateRoom(userId: string) {
  return `user_state:${userId}`;
}

export function getUsernameFromSocket(socket: Socket) {
  return socket.handshake.auth.name as string;
}
