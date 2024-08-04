import { ajv, logger, userRoom } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';
import { getChat } from './get';

interface IJoinChatPayLoad {
  chatId: number;
}

const validate = ajv.compile<IJoinChatPayLoad>({
  type: 'object',
  properties: {
    chatId: { type: 'number' },
  },
  required: ['chatId'],
  additionalProperties: false,
});

export function joinChat({ io, socket, db }: IEventListeners) {
  return async (payload: IJoinChatPayLoad, callback: TEventListenerCallback) => {
    if (typeof callback !== 'function') {
      return;
    }

    if (!validate(payload)) {
      return callback({
        status: 'ERROR',
        errors: validate.errors,
      });
    }

    try {
      const result = await db.run('INSERT INTO ChatMembers (chat_id, user_id) VALUES (?, ?)', [
        payload.chatId,
        socket.handshake.auth.userId,
      ]);

      const userId = socket.handshake.auth.userId;

      logger.info('user [%s] has joined chat [%s]', userId, payload.chatId);

      const joinedChat = await getChat(db, payload.chatId);
      // broadcast to the other tabs of the same user
      socket.to(userRoom(userId)).emit('channel:joined', joinedChat);

      io.in(userRoom(userId)).socketsJoin(`channel:${payload.chatId}`);

      return callback({
        status: 'OK',
        data: result.lastID,
      });
    } catch (e) {
      return callback({
        status: 'ERROR',
        errors: [{ message: 'failed to join' }],
      });
    }
  };
}
