import { RSC_MODULE_TYPES } from 'next/dist/shared/lib/constants';
import { z } from 'zod';
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

// Validation schemas
export const CreateRoleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required').max(50),
  description: z.string().optional(),
  status: z.boolean().default(true),
});

// Validation schema for deleting a role
export const DeleteRoleSchema = z.object({
  role_id: z.number().int().positive('Role ID must be a positive number'),
  deleteType: z.enum(['soft', 'hard']),
});

// Validation schema for updating a role
export const UpdateRoleSchema = CreateRoleSchema.extend({
  role_id: z.number().int().positive('Role ID must be a positive number'),
});
