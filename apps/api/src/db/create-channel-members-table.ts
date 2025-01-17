import { ChatDatabase } from '@/global.type';
import { logger } from '@/utils';

/**
 * Create ChatsMembers table in sqlite database. To store the relationship between user and channel
 * @param db Database instance
 */
export const createChatsMembersTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ChatsMembers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        read_to INTEGER DEFAULT 0,
        read_at DATETIME,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(chat_id) REFERENCES Chats(id),
        FOREIGN KEY(user_id) REFERENCES Users(id)
    )`);
    logger.info('Table ChatsMembers created successfully');
  } catch (error) {
    logger.error('Error creating ChatsMembers table:', error);
  }
};
