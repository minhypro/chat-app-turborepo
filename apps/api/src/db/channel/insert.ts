import { ChatDatabase } from "@/global.type";
import { Channel } from "./type";
import { v4 as uuidv4 } from "uuid";

export const insertChannel = async (
  db: ChatDatabase,
  { name, type }: Omit<Channel, "id">
): Promise<Channel> => {
  const newChannel: Channel = {
    id: uuidv4(),
    name,
    type,
  };

  await db.run(
    `INSERT INTO Channel (id, name, type)
          VALUES (?, ?, ?)`,
    [newChannel.id, newChannel.name, newChannel.type]
  );

  return newChannel;
};
