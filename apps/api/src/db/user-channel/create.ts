import { ChatDatabase } from "@/global.type";

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
      user_id TEXT NOT NULL,
      UserChannel_id TEXT NOT NULL,
      client_offset INTEGER NOT NULL,
      PRIMARY KEY (user_id, UserChannel_id),
      FOREIGN KEY (user_id) REFERENCES User(id),
      FOREIGN KEY (UserChannel_id) REFERENCES UserChannel(id)
      FOREIGN KEY (client_offset) REFERENCES Messages(id)
    )`);
    console.log("Table UserChannel created successfully");
  } catch (error) {
    console.error("Error creating UserChannel table:", error);
  }
};
