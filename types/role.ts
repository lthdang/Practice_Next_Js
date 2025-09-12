export interface CreateRoleDTO {
  role_name: string;
  description?: string;
  status?: boolean;
}

export interface UpdateRoleDTO extends CreateRoleDTO {
  role_id: number;
}

export interface RoleResponse {
  role_id: number;
  role_name: string;
  description: string | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  _count?: {
    users: number;
  };
}
