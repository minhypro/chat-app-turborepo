import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { ChatDatabase } from '@/global.type';
import { createChatsTable } from './create-chats-table';
import { createMessagesTable } from './create-messages-table';
import { createUsersTable } from './create-users-table';
import { createChatsMembersTable } from './create-channel-members-table';

// Function to open the database
const openDatabase = async (): Promise<ChatDatabase> => {
  return open({
    filename: 'chat.db',
    driver: sqlite3.Database,
  });
};

export const initDb = async () => {
  const db = await openDatabase();
  await createChatsTable(db);
  await createMessagesTable(db);
  await createUsersTable(db);
  await createChatsMembersTable(db);
  return db;
};
