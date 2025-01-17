import type { Chat, CreateChannelPayload } from '@repo/types';
import { ajv, getAuthFromSocket, logger, userRoom } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import { ChatDatabase } from '@/global.type';

const validate = ajv.compile<CreateChannelPayload>({
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 32 },
  },

  required: ['name'],
  additionalProperties: false,
});

export function createChat({ io, socket, db }: EventListeners) {
  const { username, userId } = getAuthFromSocket(socket);
  return async (payload: CreateChannelPayload, callback: EventListenerCallback) => {
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
          userId,
        ]);

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
