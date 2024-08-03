import { Server, Socket } from 'socket.io';
import { ChatDatabase } from '@/global.type';

export interface IEventListeners {
  io: Server;
  socket: Socket;
  db: ChatDatabase;
}

export type TEventListenerCallback = (arg0: { status: string; errors?: any; data?: any }) => void;
