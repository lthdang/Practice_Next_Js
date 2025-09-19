import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { apiResponse } from '../../utils/apiResponse';
import { z } from 'zod';
const prisma = new PrismaClient();

// Validation schemas
const createRoleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required').max(50),
  description: z.string().optional(),
  status: z.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - Get all roles or get by id
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      if (id) {
        const role = await prisma.role.findUnique({
          where: { role_id: Number(id) },
          include: {
            _count: {
              select: {
                users: true, // Count number of users for the role
              },
            },
          },
        });
        if (!role) {
          return apiResponse(res, 404, {
            status: 'error',
            message: `Role with ID ${id} not found`,
          });
        }

        return apiResponse(res, 200, {
          status: 'success',
          message: 'Role retrieved successfully',
          data: role,
        });
      }
      const roles = await prisma.role.findMany({
        include: {
          _count: {
            select: {
              users: true, // Count number of users for each role
            },
          },
        },
      });

      if (!roles || roles.length === 0) {
        return apiResponse(res, 404, {
          status: 'error',
          message: 'No roles found',
        });
      }

      return apiResponse(res, 200, {
        status: 'success',
        message: 'Roles retrieved successfully',
        data: roles,
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // POST - Create new role
  if (req.method === 'POST') {
    try {
      // Validate request body against schema
      const validationResult = createRoleSchema.safeParse(req.body);

      if (!validationResult.success) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'Validation failed',
          error: validationResult.error.issues,
        });
      }

      const roleData = validationResult.data;

      // Check if role_name already exists
      const existingRole = await prisma.role.findUnique({
        where: { role_name: roleData.role_name },
      });

      if (existingRole) {
        return apiResponse(res, 409, {
          status: 'error',
          message: 'Role name already exists',
        });
      }

      // Create role
      const newRole = await prisma.role.create({
        data: roleData,
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      return apiResponse(res, 201, {
        status: 'success',
        message: 'Role created successfully',
        data: newRole,
      });
    } catch (error) {
      console.error('Error creating role:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // PUT - Update role
  if (req.method === 'PUT') {
    try {
      const { role_id, ...updateData } = req.body;

      // Validation
      if (!role_id) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'role_id is required for update',
        });
      }

      // Check if role exists
      const existingRole = await prisma.role.findUnique({
        where: { role_id: Number(role_id) },
      });

      if (!existingRole) {
        return apiResponse(res, 404, {
          status: 'error',
          message: 'Role not found',
        });
      }

      // Check if new role_name already exists (excluding current role)
      if (updateData.role_name) {
        const duplicateRole = await prisma.role.findFirst({
          where: {
            AND: [{ role_id: { not: Number(role_id) } }, { role_name: updateData.role_name }],
          },
        });

        if (duplicateRole) {
          return apiResponse(res, 409, {
            status: 'error',
            message: 'Role name already exists',
          });
        }
      }

      // Update role
      const updatedRole = await prisma.role.update({
        where: { role_id: Number(role_id) },
        data: updateData,
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      return apiResponse(res, 200, {
        status: 'success',
        message: 'Role updated successfully',
        data: updatedRole,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // DELETE - Soft delete role
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      // Validation
      if (!id) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'role_id is required for deletion',
        });
      }

      // Check if role exists
      const existingRole = await prisma.role.findUnique({
        where: { role_id: Number(id) },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      if (!existingRole) {
        return apiResponse(res, 404, {
          status: 'error',
          message: 'Role not found',
        });
      }

      // Check if role has users assigned
      if (existingRole._count.users > 0) {
        return apiResponse(res, 400, {
          status: 'error',
          message: `Cannot delete role. ${existingRole._count.users} user(s) are assigned to this role.`,
        });
      }

      // Delete role
      await prisma.role.delete({
        where: { role_id: Number(id) },
      });

      return apiResponse(res, 200, {
        status: 'success',
        message: 'Role deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting role:', error);
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
