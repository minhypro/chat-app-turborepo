import { ChatDatabase } from '@/global.type';
import { logger } from '@/utils';
import { Chat } from '@repo/types';

export const fetchUserChats = async (db: ChatDatabase, userId: number) => {
  try {
    return await db.all<Chat[]>(
      `SELECT Chats.* 
       FROM Chats 
       JOIN ChatsMembers ON Chats.id = ChatsMembers.chat_id 
       WHERE ChatsMembers.user_id = ?`,
      [userId],
    );
  } catch (error) {
    logger.error('Error fetching user chats:', error);
  }
};
