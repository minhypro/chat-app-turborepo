import { ChatDatabase } from "@/global.type";
import { Message, MessageDTO } from "./type";
import { v4 as uuidv4 } from "uuid";

export const insertMessage = async (
  db: ChatDatabase,
  message: MessageDTO
): Promise<Message> => {
  const newMessage: Message = {
    id: uuidv4(),
    channel_id: message.channel_id,
    sender_id: message.sender_id,
    sent_at: new Date().toISOString(),
    content: message.content,
    is_read: false,
    read_at: null,
  };
  console.log(Object.values(newMessage));

  // await db.run(
  //   `INSERT INTO User (name, is_online, last_ping) VALUES (?, ?, ?)`,
  //   Object.values
  // );

  return newMessage;
};
