import { ajv, logger } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, ListMessagesPayLoad } from '@repo/types';

const validate = ajv.compile<ListMessagesPayLoad>({
  type: 'object',
  properties: {
    chatId: { type: 'number' },
    limit: { type: 'number' },
    offset: { type: 'number' },
  },
  additionalProperties: false,
});

export function listMessages({ db }: EventListeners) {
  return async (payload: ListMessagesPayLoad, callback: EventListenerCallback) => {
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
        [payload.query, payload.limit ?? DEFAULT_LIMIT, payload.offset ?? DEFAULT_OFFSET],
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
