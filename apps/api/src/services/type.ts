import { Server, Socket } from 'socket.io';
import { ChatDatabase } from '@/global.type';

export interface EventListeners {
  io: Server;
  socket: Socket;
  db: ChatDatabase;
}

export type EventListenerCallback = (_arg0: { status: string; errors?: any; data?: any }) => void;
