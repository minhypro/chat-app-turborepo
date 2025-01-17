import { ajv, getAuthFromSocket, logger, userRoom } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import type { Chat, ReachUserPayload } from '@repo/types';
import { insertChat } from '../chat';

const validate = ajv.compile<ReachUserPayload>({
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 32 },
    memberIds: {
      type: 'array',
      items: { type: 'number' },
      minItems: 1,
    },
  },

  required: ['name'],
  additionalProperties: false,
});

export function reachUser({ io, socket, db }: EventListeners) {
  const { username, userId } = getAuthFromSocket(socket);
  return async (payload: ReachUserPayload, callback: EventListenerCallback) => {
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
      const createdChatId = await insertChat(db, payload.name, false);
      const createdChat = await db.get<Chat>('SELECT * FROM Chats WHERE id = ?', [createdChatId]);

      if (createdChat) {
        logger.info('public chat [%s] was created by user [%s]', createdChat.name, username);

        const memberIds = [...payload.memberIds, userId];

        memberIds.forEach(async memberId => {
          await db.run('INSERT INTO ChatsMembers (chat_id, user_id) VALUES (?, ?)', [
            createdChatId,
            memberId,
          ]);
          // broadcast to other tabs of the same user
          socket.to(userRoom(memberId)).emit('chat:created', createdChat);

          io.in(userRoom(memberId)).socketsJoin(`chat:${createdChat.id}`);
        });

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
