import { ajv, getUsernameFromSocket, logger, userRoom } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';
import type { Chat } from '@repo/types';

interface ICreateChannelPayload {
  name: string;
}

const validate = ajv.compile<ICreateChannelPayload>({
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 32 },
  },

  required: ['name'],
  additionalProperties: false,
});

export function createChannel({ io, socket, db }: IEventListeners) {
  const username = getUsernameFromSocket(socket);
  return async (payload: ICreateChannelPayload, callback: TEventListenerCallback) => {
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
      const result = await db.run('INSERT INTO Chats (name, is_group) VALUES (?, ?)', [payload.name, true]);
      const chatId = result.lastID;
      const createdChat = await db.get<Chat>('SELECT * FROM Chats WHERE id = ?', [chatId]);

      if (createdChat) {
        logger.info('public chat [%s] was created by user [%s]', chatId, username);

        db.run('INSERT INTO ChatsMembers (chat_id, user_id) VALUES (?, ?)', [chatId, socket.handshake.auth.userId]);

        const userId = socket.handshake.auth.userId;
        // broadcast to other tabs of the same user
        socket.to(userRoom(userId)).emit('chat:created', createdChat);

        io.in(userRoom(userId)).socketsJoin(`chat:${createdChat.id}`);

        callback({
          status: 'OK',
          data: createdChat,
        });
      } else {
        return callback({
          status: 'ERROR',
          errors: [{ message: 'failed to insert' }],
        });
      }
    } catch (e) {
      return callback({
        status: 'ERROR',
        errors: [{ message: 'failed to insert' }],
      });
    }
  };
}
