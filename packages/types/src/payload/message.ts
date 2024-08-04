export interface AckMessagePayload {
  chatId: number;
  messageId: number;
}

export interface ListMessagesPayLoad {
  query: number;
  limit?: number;
  offset?: number;
}

export interface SendMessagePayload {
  chat_id: number;
  content: string;
}
