import { ChatDatabase } from "@/global.type";
import { logger } from "@/utils";

/**
 * Get all Channels of a specific user
 * @param db ChatDatabase instance
 * @param user_name The name of the user
 */
export const fetchUserChannels = async (
  db: ChatDatabase,
  user_name: string
) => {
  try {
    return await db.all<string[]>(
      "SELECT channel_id FROM UserChannels WHERE user_name = $1",
      [user_name]
    );
  } catch (error) {
    logger.error("Error fetching UserChannel table:", error);
    return [];
  }
};
