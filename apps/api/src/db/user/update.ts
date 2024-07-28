import { ChatDatabase } from "@/global.type";
import { User } from "./type";
import { logger } from "@/services/utils";

export const updateUser = async (
  db: ChatDatabase,
  name: string,
  updatedUser: Partial<User>
) => {
  const fields: string[] = [];
  const values: (string | boolean)[] = [];

  if (updatedUser.is_online !== undefined) {
    fields.push("is_online = ?");
    values.push(updatedUser.is_online);
  }

  if (updatedUser.last_ping !== undefined) {
    fields.push("last_ping = ?");
    values.push(updatedUser.last_ping);
  }

  if (fields.length === 0) {
    return true;
  }

  values.push(name);

  const query = `
      UPDATE User
      SET ${fields.join(", ")}
      WHERE name = ?
  `;

  db.run(query, values).catch((err) => {
    logger.error(`Failed to update user: ${name}`, err);
    return false;
  });
  return true;
};
