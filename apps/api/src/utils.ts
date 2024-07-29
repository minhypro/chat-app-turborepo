import { createLogger, transports } from "winston";

export const logger = createLogger({
  level: "info",
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console());
}

export function channelRoom(channelId: string) {
  return `channel:${channelId}`;
}

export function userRoom(userId: string) {
  return `user:${userId}`;
}

export function userStateRoom(userId: string) {
  return `user_state:${userId}`;
}
