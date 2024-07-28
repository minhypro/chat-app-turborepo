import { ChatDatabase } from "@/global.type";

/**
 * Create User table in sqlite database. To store the users
 * @param db Database instance
 */
export const createUserTable = async (db: ChatDatabase): Promise<void> => {
  try {
    await db.exec(`
       CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE,
        is_online BOOLEAN NOT NULL,
        last_ping TEXT NOT NULL
        )
      `);
    console.log("Table User created successfully");
  } catch (error) {
    console.error("Error creating User table:", error);
  }
};
