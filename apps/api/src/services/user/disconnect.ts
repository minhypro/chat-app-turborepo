import { ChatDatabase } from '@/global.type';

export const userDisconnect = async (db: ChatDatabase, userId: number) => {
  db.run('UPDATE Users SET is_online = FALSE, last_active = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
};
