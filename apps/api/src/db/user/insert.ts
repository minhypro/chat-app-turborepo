import { ChatDatabase } from "@/global.type";
import { User } from "./type";
import { v4 as uuidv4 } from "uuid";

export const insertUser = async (
  db: ChatDatabase,
  name: string
): Promise<User> => {
  const newUser: User = {
    id: uuidv4(),
    name: name,
    is_online: true,
    last_ping: new Date().toISOString(),
  };

  await db.run(
    `INSERT INTO User (id, name, is_online, last_ping)
          VALUES (?, ?, ?, ?)`,
    [newUser.id, newUser.name, newUser.is_online, newUser.last_ping]
  );

  return newUser;
};
