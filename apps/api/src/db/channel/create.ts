import { ChatDatabase } from '@/global.type';
import { logger } from '@/utils';

/**
 * Create Channels table in sqlite database. To store the channels
 * @param db Database instance
 */
export const createChannelTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        is_group BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
      `);
    logger.info('Table Channels created successfully');
  } catch (error) {
    logger.error('Error creating Channels table:', error);
  }
};
