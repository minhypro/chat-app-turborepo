import { ChatDatabase } from '@/global.type';
import { logger } from '@/utils';

/**
 * Create Chats table in sqlite database. To store the conversations
 * @param db Database instance
 */
export const createChatsTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
      `);
    logger.info('Table Chats created successfully');
  } catch (error) {
    logger.error('Error creating Chats table:', error);
  }
};
