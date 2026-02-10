import { z } from 'zod';

// Base Student Schema
export const StudentSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  address: z.string().optional(),
  date_of_birth: z.string().or(z.date()).optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
});

// Create Student Schema (for signup)
export const CreateStudentSchema = StudentSchema.extend({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  address: z.string().min(1, 'Address is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  avatar: z.string().optional(),
});

// Update Student Schema
export const UpdateStudentSchema = z.object({
  student_id: z.number().int().positive('Student ID must be a positive number'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  address: z.string().optional(),
  date_of_birth: z.string().or(z.date()).optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  status: z.boolean().optional(),
});

// Response DTOs
export interface StudentResponseDTO {
  student_id: number;
  full_name: string;
  email: string;
  address?: string;
  date_of_birth?: Date;
  avatar?: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface StudentData {
  student_id: number;
  full_name: string;
  email: string;
  address?: string;
  date_of_birth?: Date;
  avatar?: string;
  status: boolean;
}

// Type inference from schemas
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type StudentInput = z.infer<typeof StudentSchema>;
