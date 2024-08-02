import { dbHelper } from "@/db";
import { ChatDatabase } from "@/global.type";

export const fetchUserChannels = async (db: ChatDatabase, name: string) => {
  const foundChannels = await dbHelper.channelMemberDb.fetchUserChannels(
    db,
    name
  );

  return foundChannels;
};
