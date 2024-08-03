import { dbHelper } from '@/db';
import { ChatDatabase } from '@/global.type';

export const disconnect = async (db: ChatDatabase, name: string) => {
  return dbHelper.userDb.updateUser(db, name, {
    is_online: false,
    last_ping: new Date().toISOString(),
  });
};
