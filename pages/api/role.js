import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // GET - Get all roles
  if (req.method === "GET") {
    try {
      const roles = await prisma.role.findMany({
        include: {
          _count: {
            select: {
              users: true, // Count number of users for each role
            },
          },
        },
      });

      return res.status(200).json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // POST - Create new role
  if (req.method === "POST") {
    try {
      const { role_name } = req.body;

      // Validation
      if (!role_name) {
        return res.status(400).json({
          message: "role_name is required",
        });
      }

      // Check if role_name already exists
      const existingRole = await prisma.role.findUnique({
        where: { role_name: role_name },
      });

      if (existingRole) {
        return res.status(409).json({
          message: "Role name already exists",
        });
      }

      // Create role
      const newRole = await prisma.role.create({
        data: {
          role_name,
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      return res.status(201).json(newRole);
    } catch (error) {
      console.error("Error creating role:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // PUT - Update role
  if (req.method === "PUT") {
    try {
      const { role_id, role_name } = req.body;

      // Validation
      if (!role_id || !role_name) {
        return res.status(400).json({
          message: "role_id and role_name are required for update",
        });
      }

      // Check if role exists
      const existingRole = await prisma.role.findUnique({
        where: { role_id: parseInt(role_id) },
      });

      if (!existingRole) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      // Check if new role_name already exists (excluding current role)
      const duplicateRole = await prisma.role.findFirst({
        where: {
          AND: [
            { role_id: { not: parseInt(role_id) } },
            { role_name: role_name },
          ],
        },
      });

      if (duplicateRole) {
        return res.status(409).json({
          message: "Role name already exists",
        });
      }

      // Update role
      const updatedRole = await prisma.role.update({
        where: { role_id: parseInt(role_id) },
        data: {
          role_name,
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      return res.status(200).json(updatedRole);
    } catch (error) {
      console.error("Error updating role:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // DELETE - Soft delete role (only if no users are assigned)
  if (req.method === "DELETE") {
    try {
      const { role_id } = req.body;

      // Validation
      if (!role_id) {
        return res.status(400).json({
          message: "role_id is required for deletion",
        });
      }

      // Check if role exists
      const existingRole = await prisma.role.findUnique({
        where: { role_id: parseInt(role_id) },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      if (!existingRole) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      // Check if role has users assigned
      if (existingRole._count.users > 0) {
        return res.status(400).json({
          message: `Cannot delete role. ${existingRole._count.users} user(s) are assigned to this role.`,
        });
      }

      // Delete role
      await prisma.role.delete({
        where: { role_id: parseInt(role_id) },
      });

      return res.status(200).json({
        message: "Role deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
