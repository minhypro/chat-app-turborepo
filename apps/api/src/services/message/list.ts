import { ajv, logger } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';

interface IQueryPayLoad {
  chatId: number;
  limit: number;
  offset: number;
}

const validate = ajv.compile<IQueryPayLoad>({
  type: 'object',
  properties: {
    chatId: { type: 'number' },
    limit: { type: 'number' },
    offset: { type: 'number' },
  },
  additionalProperties: false,
});

export function listMessages({ db }: IEventListeners) {
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
      const messages = await db.all(
        'SELECT * FROM Messages WHERE chat_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?',
        [payload.chatId, payload.limit, payload.offset],
      );

      logger.info('messages: %j', messages);

      return callback({
        status: 'OK',
        data: messages,
      });
    } catch (e) {
      logger.error('failed to get messages: %s', e);
      return callback({
        status: 'ERROR',
        errors: [{ message: 'failed to get messages' }],
      });
    }
  };
}
