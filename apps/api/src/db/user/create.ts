import { ChatDatabase } from "@/global.type";
import { logger } from "@/utils";

/**
 * Create User table in sqlite database. To store the users
 * @param db Database instance
 */
export const createUserTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
       CREATE TABLE IF NOT EXISTS User (
        name TEXT PRIMARY KEY NOT NULL,
        is_online BOOLEAN NOT NULL,
        last_ping TEXT NOT NULL
        )
      `);
    logger.info("Table User created successfully");
  } catch (error) {
    logger.error("Error creating User table:", error);
  }
};
