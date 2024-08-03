import { ChatDatabase } from '@/global.type';
import { logger } from '@/utils';

/**
 * Create messages table in sqlite database. To store the messages
 * @param db Database instance
 */
export const createMessagesTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(chat_id) REFERENCES Chats(id),
        FOREIGN KEY(sender_id) REFERENCES Users(id)
      )`);
    logger.info('Table Messages created successfully');
  } catch (error) {
    logger.error('Error creating Messages table:', error);
  }
};
