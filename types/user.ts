import { z } from 'zod';
import { Role } from './role';

// Base User Schema
export const UserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  full_name: z.string().optional(),
  role_id: z.number().int().positive('Role ID must be a positive number'),
});

// Create User Schema (extends base with password)
export const CreateUserSchema = UserSchema.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Update User Schema (all fields optional except user_id)
export const UpdateUserSchema = z.object({
  user_id: z.number().int().positive('User ID must be a positive number'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  full_name: z.string().optional(),
  role_id: z.number().int().positive('Role ID must be a positive number').optional(),
  status: z.boolean().optional(),
});

// Response DTOs
export interface UserResponseDTO {
  user_id: number;
  username: string;
  email: string;
  full_name?: string;
  role_id: number;
  role: {
    role_name: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface UserData {
  user_id: number;
  username: string;
  email: string;
  full_name?: string;
  role_id: number;
  role: Role;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type UpdateUserData = z.infer<typeof UpdateUserSchema>;
