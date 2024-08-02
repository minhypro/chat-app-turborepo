import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { ChatDatabase } from "@/global.type";
import { channelDb } from "./channel";
import { messageDb } from "./message";
import { channelMemberDb } from "./channel-member";
import { dbHelper } from "./helper";

// Function to open the database
const openDatabase = async (): Promise<ChatDatabase> => {
  return open({
    filename: "chat.db",
    driver: sqlite3.Database,
  });
};

export const initDb = async () => {
  const db = await openDatabase();
  await channelDb.createChannelTable(db);
  await messageDb.createMessagesTable(db);
  await dbHelper.userDb.createUserTable(db);
  await channelMemberDb.createChannelMembersTable(db);
  return db;
};
