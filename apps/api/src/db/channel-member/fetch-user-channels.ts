import { ChatDatabase } from "@/global.type";
import { logger } from "@/utils";

/**
 * Get all Channels of a specific user
 * @param db ChatDatabase instance
 * @param user_name The name of the user
 */
export const fetchUserChannels = async (db: ChatDatabase, userId: string) => {
  try {
    // Fetch channels of the user
    const channels = await db.all(
      `SELECT Channels.id, Channels.name, Channels.is_group, Channels.created_at, Channels.updated_at
       FROM Channels
       JOIN ChannelMembers ON Channels.id = ChannelMembers.channel_id
       WHERE ChannelMembers.user_id = ?`,
      [userId]
    );

    logger.log(`Channels for user ${userId}:`, channels);
    return channels;
  } catch (error) {
    logger.error("Error fetching user channels:", error);
  }
};
