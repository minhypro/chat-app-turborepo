import { ChatDatabase } from '@/global.type';
import { logger } from '@/utils';

/**
 * Create User table in sqlite database. To store the users
 * @param db Database instance
 */
export const createUsersTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      is_online BOOLEAN DEFAULT FALSE,
      last_active DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
    logger.info('Table User created successfully');
  } catch (error) {
    logger.error('Error creating User table:', error);
  }
};
