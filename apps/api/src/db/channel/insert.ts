import { ChatDatabase } from "@/global.type";
import { Channel } from "./type";
import { v4 as uuidv4 } from "uuid";

export const insertChannel = async (
  db: ChatDatabase,
  { name, type }: Channel
): Promise<Channel> => {
  const newUser: Channel = {
    id: uuidv4(),
    name,
    type,
  };

  await db.run(
    `INSERT INTO Channel (id, name, type)
          VALUES (?, ?, ?, ?)`,
    [newUser.id, newUser.name, newUser.type]
  );

  return newUser;
};
