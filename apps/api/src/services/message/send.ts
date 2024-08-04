import { ajv, channelRoom, getAuthFromSocket } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import { SendMessagePayload, Message, MessageDTO } from '@repo/types';

const validate = ajv.compile<SendMessagePayload>({
  type: 'object',
  properties: {
    content: { type: 'string', minLength: 1, maxLength: 5000 },
    chat_id: { type: 'integer' },
  },
  required: ['content', 'chat_id'],
  additionalProperties: false,
});

export function sendMessage({ socket, db }: EventListeners) {
  return async (payload: SendMessagePayload, callback: EventListenerCallback) => {
    if (typeof callback !== 'function') {
      return;
    }

    if (!validate(payload)) {
      return callback({
        status: 'ERROR',
        errors: validate.errors,
      });
    }

    const { userId } = getAuthFromSocket(socket);

    const message: MessageDTO = {
      sender_id: userId,
      chat_id: payload.chat_id,
      content: payload.content,
    };

    try {
      const result = await db.run(
        'INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
        [message.chat_id, message.sender_id, message.content],
      );
      const messageId = result.lastID;
      const createdMessage = await db.get<Message>('SELECT * FROM Messages WHERE id = ?', [
        messageId,
      ]);

      if (createdMessage) {
        socket.broadcast.to(channelRoom(createdMessage?.chat_id)).emit('message:sent', message);

        callback({
          status: 'OK',
          data: {
            message: createdMessage,
          },
        });
      } else {
        return callback({
          status: 'ERROR',
        });
      }
    } catch (_) {
      return callback({
        status: 'ERROR',
      });
    }
  };
}
