export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export type MessageDTO = Pick<Message, "chat_id" | "sender_id" | "content">;
