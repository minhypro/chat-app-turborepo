export * from './ajv';
export * from './logger';

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

export function getAuthFromSocket(socket: Socket) {
  return {
    userId: socket.handshake.auth.userId as number,
    username: socket.handshake.auth.username as string,
  };
}
