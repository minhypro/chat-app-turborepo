import { createLogger } from "winston";

export const logger = createLogger({
  level: "info",
});

export function channelRoom(channelId: string) {
  return `channel:${channelId}`;
}

export function userRoom(userId: string) {
  return `user:${userId}`;
}

export function sessionRoom(sessionId: string) {
  return `session:${sessionId}`;
}

export function userStateRoom(userId: string) {
  return `user_state:${userId}`;
}
