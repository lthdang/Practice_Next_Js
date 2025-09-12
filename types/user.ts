import { z } from 'zod';

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
export const UpdateUserSchema = UserSchema.partial().extend({
  user_id: z.number().int().positive('User ID must be a positive number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
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

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
