export interface User {
  id: string;
  username: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  data: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
