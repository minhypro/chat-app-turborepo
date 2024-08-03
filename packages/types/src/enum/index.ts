export enum EventName {
  CONNECT = "connect",
  DISCONNECT = "disconnect",

  CREATE_CHAT = "chat:create",
  LIST_CHAT = "chat:list",
  JOIN_CHAT = "chat:join",
  SEARCH_CHAT = "chat:search",

  GET_USER = "user:get",
  REACH_USER = "user:reach",
  SEARCH_USER = "user:search",

  SEND_MESSAGE = "message:send",
  LIST_MESSAGE = "message:list",
  ACK_MESSAGE = "message:ack",
  TYPING_MESSAGE = "message:typing",
}
