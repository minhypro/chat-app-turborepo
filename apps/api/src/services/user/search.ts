import { ajv } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';
import type { Chat } from '@repo/types';

interface IQueryPayLoad {
  query: string;
  limit: number;
}

const validate = ajv.compile<IQueryPayLoad>({
  type: 'object',
  properties: {
    query: { type: 'string' },
    limit: { type: 'number' },
  },
  additionalProperties: false,
});

export function searchUsers({ db }: IEventListeners) {
  return async (payload: IQueryPayLoad, callback: TEventListenerCallback) => {
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
            payload.limit,
          ])
        : await db.all<Chat[]>('SELECT * FROM Users LIMIT ?', [payload.limit]);

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
