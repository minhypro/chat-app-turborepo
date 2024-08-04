import { ajv, userStateRoom } from '@/utils';
import { IEventListeners, TEventListenerCallback } from '../type';
import type { User } from '@repo/types';

interface IPayLoad {
  userId: number;
}

const validate = ajv.compile<IPayLoad>({
  type: 'object',
  properties: {
    userId: { type: 'number' },
  },
  required: ['userId'],
  additionalProperties: false,
});

export function getUser({ socket, db }: IEventListeners) {
  return async (payload: IPayLoad, callback: TEventListenerCallback) => {
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
