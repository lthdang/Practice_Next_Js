export interface CreateRoleDTO {
  role_name: string;
  description?: string;
  status?: boolean;
}

export interface UpdateRoleDTO extends CreateRoleDTO {
  role_id: number;
}

export interface Role {
  role_id: number;
  role_name: string;
  status: boolean;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}
