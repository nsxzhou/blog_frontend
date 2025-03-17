export interface ChatMessage {
  id?: number;
  type?: string;
  message_id?: number;
  user_id?: number;
  username?: string;
  content?: string;
  status?: string;
  created_at?: string;
  limit?: number;
  messages?: ChatMessage[];
  users?: User[];
}

export interface User {
  id: number;
  name: string;
  online: boolean;
}
