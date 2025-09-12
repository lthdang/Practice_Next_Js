import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { CreateUserSchema, UpdateUserSchema } from '../../types/user';
import bcrypt from 'bcryptjs';
import { apiResponse } from '../../utils/apiResponse';
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - Get all users
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          user_id: true,
          username: true,
          email: true,
          full_name: true,
          role_id: true,
          created_at: true,
          updated_at: true,
          role: {
            select: {
              role_name: true,
            },
          },
        },
        where: {
          deleted_at: null, // Only get non-deleted users
        },
      });

      return apiResponse(res, 200, {
        status: 'success',
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }

  // POST - Create new user
  if (req.method === 'POST') {
    try {
      const validationResult = CreateUserSchema.safeParse(req.body);

      // Validation
      if (!validationResult.success) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'Validation failed',
          error: validationResult.error.issues,
        });
      }
      const { password, ...userData } = validationResult.data;
      if (!password) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'Password is required',
        });
      }
      // Check if username or email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: userData.username }, { email: userData.email }],
        },
      });

      if (existingUser) {
        return apiResponse(res, 409, {
          status: 'error',
          message: 'Username or email already exists',
        });
      }

      // Hash password
      let password_hash: string;
      try {
        password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      } catch (error) {
        console.error('Error hashing password:', error);
        return apiResponse(res, 500, {
          status: 'error',
          message: 'Error processing password',
        });
      }

      // Create user
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password_hash,
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          full_name: true,
          role_id: true,
          created_at: true,
          role: {
            select: {
              role_name: true,
            },
          },
        },
      });

      return apiResponse(res, 201, {
        status: 'success',
        message: 'User created successfully',
        data: newUser,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // PUT - Update user
  if (req.method === 'PUT') {
    try {
      const validationResult = UpdateUserSchema.safeParse(req.body);

      // Validation
      if (!validationResult.success) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'Validation failed',
          error: validationResult.error.issues,
        });
      }
      const { user_id, password, ...updateDataUpdate } = validationResult.data;
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { user_id },
      });

      if (!existingUser) {
        return apiResponse(res, 404, {
          status: 'error',
          message: 'User not found',
        });
      }

      // Check for duplicate username/email (excluding current user)
      if (updateDataUpdate.username || updateDataUpdate.email) {
        const duplicateUser = await prisma.user.findFirst({
          where: {
            AND: [
              { user_id: { not: user_id } },
              {
                OR: [
                  ...(updateDataUpdate.username ? [{ username: updateDataUpdate.username }] : []),
                  ...(updateDataUpdate.email ? [{ email: updateDataUpdate.email }] : []),
                ],
              },
            ],
          },
        });

        if (duplicateUser) {
          return res.status(409).json({
            message: 'Username or email already exists',
          });
        }
      }

      // Hash new password if provided
      if (password) {
        updateDataUpdate['password_hash'] = await bcrypt.hash(password, 10);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { user_id },
        data: updateDataUpdate,
        select: {
          user_id: true,
          username: true,
          email: true,
          full_name: true,
          role_id: true,
          created_at: true,
          updated_at: true,
          role: {
            select: {
              role_name: true,
            },
          },
        },
      });

      return apiResponse(res, 200, {
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return apiResponse(res, 405, {
    status: 'error',
    message: 'Method Not Allowed',
  });
}
