import { ajv } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';
import type { Chat } from '@repo/types';

interface IQueryPayLoad {
  query: string;
  limit: number;
  offset: number;
}

const validate = ajv.compile<IQueryPayLoad>({
  type: 'object',
  properties: {
    query: { type: 'string' },
    limit: { type: 'number' },
    offset: { type: 'number' },
  },

  additionalProperties: false,
});

export function listChats({ db }: IEventListeners) {
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
        ? await db.all<Chat[]>(
            'SELECT * FROM Chats WHERE is_public = TRUE AND name LIKE ? LIMIT ? OFFSET ?',
            [searchPattern, payload.limit, payload.offset],
          )
        : await db.all<Chat[]>('SELECT * FROM Chats WHERE is_public = TRUE LIMIT ? OFFSET ?', [
            payload.limit,
            payload.offset,
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
