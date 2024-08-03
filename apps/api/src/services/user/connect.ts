import { dbHelper } from '@/db';
import { ChatDatabase } from '@/global.type';

export const connect = async (db: ChatDatabase, name: string) => {
  const foundUser = await dbHelper.userDb.findUserByName(db, name);

  if (!foundUser) {
    dbHelper.userDb.insertUser(db, name);
  }

  dbHelper.userDb.updateUser(db, name, {
    is_online: true,
    last_ping: new Date().toISOString(),
  });
};
