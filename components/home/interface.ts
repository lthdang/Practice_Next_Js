import { ReactNode } from 'react';

export interface MenuData {
  id: string;
  name: string;
  icon?: ReactNode;
  path?: string;
  children?: MenuData[];
}

export interface UserData {
  user_id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role_id: number;
  role: {
    role_name: string;
  };
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DashboardCard {
  title: string;
  value: string;
  change: string;
  color: 'success' | 'primary' | 'warning' | 'secondary';
  icon: ReactNode;
}
