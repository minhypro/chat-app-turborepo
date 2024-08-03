import { createLogger, transports, format } from 'winston';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Socket } from 'socket.io';

const ajv = new Ajv({
  useDefaults: true,
});

addFormats(ajv);

export { ajv };

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.splat(), format.simple(), format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console());
}

export function channelRoom(channelId: number) {
  return `channel:${channelId}`;
}

export function userRoom(userId: number) {
  return `user:${userId}`;
}

export function userStateRoom(userId: number) {
  return `user_state:${userId}`;
}

export function getUsernameFromSocket(socket: Socket) {
  return socket.handshake.auth.name as string;
}
