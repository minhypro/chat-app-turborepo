import { ajv, getAuthFromSocket } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';

interface ICreateChannelPayload {
  chatId: number;
  messageId: number;
}

const validate = ajv.compile<ICreateChannelPayload>({
  type: 'object',
  properties: {
    chatId: { type: 'number' },
    messageId: { type: 'number' },
  },
  required: ['chatId', 'messageId'],
  additionalProperties: false,
});

export function ackMessage({ socket, db }: IEventListeners) {
  const { userId } = getAuthFromSocket(socket);
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
