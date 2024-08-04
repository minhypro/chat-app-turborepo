export interface CreateChannelPayload {
  name: string;
}

export interface JoinChatPayLoad {
  chatId: number;
}

export interface ListChatPayLoad {
  query: string;
  limit?: number;
  offset?: number;
}
