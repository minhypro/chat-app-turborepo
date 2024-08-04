import { ajv } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, type Chat, type ListChatPayLoad } from '@repo/types';

const validate = ajv.compile<ListChatPayLoad>({
  type: 'object',
  properties: {
    query: { type: 'string' },
    limit: { type: 'number' },
    offset: { type: 'number' },
  },

  additionalProperties: false,
});

export function listChats({ db }: EventListeners) {
  return async (payload: ListChatPayLoad, callback: EventListenerCallback) => {
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
      const searchPattern = `%${payload.query}%`;

      const chats = searchPattern
        ? await db.all<Chat[]>(
            'SELECT * FROM Chats WHERE is_public = TRUE AND name LIKE ? LIMIT ? OFFSET ?',
            [searchPattern, payload.limit ?? DEFAULT_LIMIT, payload.offset ?? DEFAULT_OFFSET],
          )
        : await db.all<Chat[]>('SELECT * FROM Chats WHERE is_public = TRUE LIMIT ? OFFSET ?', [
            payload.limit ?? DEFAULT_LIMIT,
            payload.offset ?? DEFAULT_OFFSET,
          ]);

      return callback({
        status: 'OK',
        data: chats,
      });
    } catch (e) {
      return callback({
        status: 'ERROR',
        errors: [{ message: 'failed to query' }],
      });
    }
  };
}
