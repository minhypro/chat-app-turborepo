import { ajv, getAuthFromSocket } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import { AckMessagePayload } from '@repo/types';

const validate = ajv.compile<AckMessagePayload>({
  type: 'object',
  properties: {
    chatId: { type: 'number' },
    messageId: { type: 'number' },
  },
  required: ['chatId', 'messageId'],
  additionalProperties: false,
});

export function ackMessage({ socket, db }: EventListeners) {
  const { userId } = getAuthFromSocket(socket);
  return async (payload: AckMessagePayload, callback: EventListenerCallback) => {
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
      const result = await db.run(
        'UPDATE ChatMembers SET read_to = ? WHERE chat_id = ? AND user_id = ?',
        [payload.messageId, payload.chatId, userId],
      );

      return callback({
        status: 'OK',
        data: result.lastID,
      });
    } catch (e) {
      return callback({
        status: 'ERROR',
        errors: [{ message: 'failed to insert' }],
      });
    }
  };
}
