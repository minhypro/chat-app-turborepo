import { ajv, getAuthFromSocket, logger, userRoom } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import { getChat } from './get';
import { JoinChatPayLoad } from '@repo/types';

const validate = ajv.compile<JoinChatPayLoad>({
  type: 'object',
  properties: {
    chatId: { type: 'number' },
  },
  required: ['chatId'],
  additionalProperties: false,
});

export function joinChat({ io, socket, db }: EventListeners) {
  return async (payload: JoinChatPayLoad, callback: EventListenerCallback) => {
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
      const { userId } = getAuthFromSocket(socket);
      const result = await db.run('INSERT INTO ChatMembers (chat_id, user_id) VALUES (?, ?)', [
        payload.chatId,
        userId,
      ]);

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
