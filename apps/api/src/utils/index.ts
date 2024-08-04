export * from './ajv';
export * from './logger';
export * from './do-in-transaction';

import { Socket } from 'socket.io';

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
