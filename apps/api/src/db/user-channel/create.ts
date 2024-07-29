import { ChatDatabase } from "@/global.type";
import { logger } from "@/utils";

/**
 * Create UserChannel table in sqlite database. To store the relationship between user and channel
 * @param db Database instance
 */
export const createUserChannelTable = async (
  db: ChatDatabase
): Promise<void> => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS UserChannels (
      user_name TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      client_offset INTEGER NOT NULL,
      PRIMARY KEY (user_name, Channel_id),
      FOREIGN KEY (user_name) REFERENCES User(name),
      FOREIGN KEY (channel_id) REFERENCES Channel(id)
      FOREIGN KEY (client_offset) REFERENCES Messages(id)
    )`);
    logger.info("Table UserChannel created successfully");
  } catch (error) {
    logger.error("Error creating UserChannel table:", error);
  }
};
