import { ChatDatabase } from "@/global.type";
import { Message, MessageDTO } from "./type";
import { v4 as uuidv4 } from "uuid";

export const readMessage = async (db: ChatDatabase, messageId: number) => {
  try {
    // Update the message's read status and read_at timestamp
    await db.run(
      `UPDATE Messages SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [messageId]
    );
    console.log(`Message ${messageId} marked as read`);
  } catch (error) {
    console.error("Error updating message read status:", error);
  }
};
