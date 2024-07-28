export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  sent_at: string;
  content: string;
  is_read: boolean;
  read_at: string;
}
