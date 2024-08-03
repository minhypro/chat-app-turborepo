export interface Chat {
  id: number;
  name: string;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

export type ChatDTO = Pick<Chat, "name" | "is_group">;
