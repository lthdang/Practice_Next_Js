import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { CreateStudentSchema } from '../../../types/student';
import { apiResponse } from '../../../utils/apiResponse';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST - Create new student (signup)
  if (req.method === 'POST') {
    try {
      // Validate input data
      const validationResult = CreateStudentSchema.safeParse(req.body);

      if (!validationResult.success) {
        const errors = validationResult.error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return apiResponse(res, 400, {
          status: 'error',
          message: 'Validation failed',
          error: errors,
        });
      }

      const { full_name, email, address, date_of_birth, avatar } = validationResult.data;

      // Check if email already exists
      const existingStudent = await prisma.student.findUnique({
        where: { email },
      });

      if (existingStudent) {
        return apiResponse(res, 409, {
          status: 'error',
          message: 'Email already registered',
        });
      }

      // Create new student
      const newStudent = await prisma.student.create({
        data: {
          full_name,
          email,
          address,
          date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
          avatar: avatar || null,
          status: true, // Default status for new students
        },
        select: {
          student_id: true,
          full_name: true,
          email: true,
          address: true,
          date_of_birth: true,
          avatar: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });

      return apiResponse(res, 201, {
        status: 'success',
        message: 'Student registered successfully',
        data: newStudent,
      });
    } catch (error) {
      console.error('Error creating student:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Method not allowed
  return apiResponse(res, 405, {
    status: 'error',
    message: 'Method not allowed',
  });
}
