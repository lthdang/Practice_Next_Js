export interface Role {
  id: number;
  role_name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserData {
  user_id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role_id: number;
  role: Role;
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    user: UserData;
    token: string;
    redirectTo?: string;
  };
}
