import { ajv } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';

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

export function listChats({ socket, db }: IEventListeners) {
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

      return callback({
        status: 'OK',
        data: result.lastID,
      });
    } catch (e) {
      return callback({
        status: 'ERROR',
        errors: [{ message: 'failed to query' }],
      });
    }
  };
}
