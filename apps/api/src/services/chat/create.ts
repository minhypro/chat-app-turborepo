import { ajv, getUsernameFromSocket, logger, userRoom } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';
import type { Chat } from '@repo/types';
import { ChatDatabase } from '@/global.type';

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

export function createChat({ io, socket, db }: IEventListeners) {
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
      const createdChatId = await insertChat(db, payload.name, true);
      const createdChat = await db.get<Chat>('SELECT * FROM Chats WHERE id = ?', [createdChatId]);

      if (createdChat) {
        logger.info('public chat [%s] was created by user [%s]', createdChatId, username);

        db.run('INSERT INTO ChatsMembers (chat_id, user_id) VALUES (?, ?)', [
          createdChatId,
          socket.handshake.auth.userId,
        ]);

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

export const insertChat = async (db: ChatDatabase, name: string, isPublic: boolean) => {
  try {
    const result = await db.run('INSERT INTO Chats (name, is_public) VALUES (?, ?)', [
      name,
      isPublic,
    ]);
    logger.info('chat inserted', result);
    return result.lastID;
  } catch (error) {
    logger.error('failed to insert chat', error);
  }
};
