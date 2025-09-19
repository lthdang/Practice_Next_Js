import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { apiResponse } from '../../../utils/apiResponse';
import { z } from 'zod';

const prisma = new PrismaClient();

const UpdateStatusSchema = z.object({
  user_id: z.number().int().positive('User ID must be a positive number'),
  status: z.boolean(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return apiResponse(res, 405, {
      status: 'error',
      message: 'Method Not Allowed',
    });
  }

  try {
    const validationResult = UpdateStatusSchema.safeParse(req.body);

    if (!validationResult.success) {
      return apiResponse(res, 400, {
        status: 'error',
        message: 'Validation failed',
        error: validationResult.error.issues,
      });
    }

    const { user_id, status } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!existingUser) {
      return apiResponse(res, 404, {
        status: 'error',
        message: 'User not found',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { status },
      select: {
        user_id: true,
        username: true,
        status: true,
      },
    });

    return apiResponse(res, 200, {
      status: 'success',
      message: `User status ${status ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return apiResponse(res, 500, {
      status: 'error',
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
