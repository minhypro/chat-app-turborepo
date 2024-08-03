import { ChatDatabase } from '@/global.type';
import { User } from '@repo/types';

export const connect = async (db: ChatDatabase, name: string) => {
  const foundUser = await db.get<User>(`SELECT * FROM Users WHERE name = ?`, [name]);

  if (foundUser) {
    await db.run('UPDATE Users SET is_online = TRUE, last_active = CURRENT_TIMESTAMP WHERE id = ?', [foundUser.id]);
  } else {
    await db.run('INSERT INTO Users (name) VALUES (?)', [name]);
  }

  return foundUser?.id;
};
