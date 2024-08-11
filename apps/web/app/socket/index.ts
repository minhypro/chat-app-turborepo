'use client';
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const initSocket = (username: string) => {
  return io(URL ?? window.location.origin, {
    auth: {
      username,
    },
    autoConnect: false,
  });
};
