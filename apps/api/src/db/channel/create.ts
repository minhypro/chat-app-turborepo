import { ChatDatabase } from "@/global.type";
import { logger } from "@/utils";

/**
 * Create Channel table in sqlite database. To store the channels
 * @param db Database instance
 */
export const createChannelTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
       CREATE TABLE IF NOT EXISTS Channel (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL
    )
      `);
    logger.info("Table Channel created successfully");
  } catch (error) {
    logger.error("Error creating Channel table:", error);
  }
};
