import { ChatDatabase } from '@/global.type';
import { Chat } from '@repo/types';

export const getChat = async (db: ChatDatabase, chatId: number) => {
  const chat = await db.get<Chat>('SELECT * FROM Chats WHERE id = ?', [chatId]);

  return chat;
};
