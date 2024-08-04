import { ajv } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import { DEFAULT_LIMIT, type Chat, type SearchUserPayLoad } from '@repo/types';

const validate = ajv.compile<SearchUserPayLoad>({
  type: 'object',
  properties: {
    query: { type: 'string' },
    limit: { type: 'number' },
  },
  additionalProperties: false,
});

export function searchUsers({ db }: EventListeners) {
  return async (payload: SearchUserPayLoad, callback: EventListenerCallback) => {
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
        ? await db.all<Chat[]>('SELECT * FROM Users WHERE name LIKE ? LIMIT ?', [
            searchPattern,
            payload.limit ?? DEFAULT_LIMIT,
          ])
        : await db.all<Chat[]>('SELECT * FROM Users LIMIT ?', [payload.limit ?? DEFAULT_LIMIT]);

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
