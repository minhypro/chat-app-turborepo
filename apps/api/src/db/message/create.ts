import { ChatDatabase } from "@/global.type";

/**
 * Create messages table in sqlite database. To store the messages
 * @param db Database instance
 */
export const createMessagesTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        sent_at TEXT NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN NOT NULL,
        read_at TEXT
        )
        `);
    console.log("Table Messages created successfully");
  } catch (error) {
    console.error("Error creating Messages table:", error);
  }
};
