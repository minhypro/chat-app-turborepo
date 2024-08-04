import { ajv, userStateRoom } from '@/utils';
import { EventListeners, EventListenerCallback } from '../type';
import type { GetUserPayLoad, User } from '@repo/types';

const validate = ajv.compile<GetUserPayLoad>({
  type: 'object',
  properties: {
    userId: { type: 'number' },
  },
  required: ['userId'],
  additionalProperties: false,
});

export function getUser({ socket, db }: EventListeners) {
  return async (payload: GetUserPayLoad, callback: EventListenerCallback) => {
    if (typeof callback !== 'function') {
      return;
    }

    if (!validate(payload)) {
      return callback({
        status: 'ERROR',
        errors: validate.errors,
      });
    }

    const user = await db.get<User>('SELECT * FROM Users WHERE id = ?', [payload.userId]);

    if (user) {
      // the user will be notified of any change of the user state
      socket.join(userStateRoom(user.id));

      callback({
        status: 'OK',
        data: user,
      });
    } else {
      callback({
        status: 'ERROR',
      });
    }
  };
}
