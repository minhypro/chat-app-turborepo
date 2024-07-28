import { ChatDatabase } from "@/global.type";
import { User } from "./type";

export const findUserByName = async (db: ChatDatabase, name: string) => {
  const foundUser = await db.get<User>(`SELECT * FROM User WHERE name = ?`, [
    name,
  ]);
  return foundUser;
};
