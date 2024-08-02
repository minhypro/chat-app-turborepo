import { createChannelMembersTable } from "./create";
import { fetchUserChannels } from "./fetch-user-channels";

export const channelMemberDb = {
  createChannelMembersTable,
  fetchUserChannels,
};
