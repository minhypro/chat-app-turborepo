import { channelDb } from './channel';
import { messageDb } from './message';
import { userDb } from './user';
import { channelMemberDb } from './channel-member';

export const dbHelper = {
  userDb,
  channelMemberDb,
  channelDb,
  messageDb,
};
