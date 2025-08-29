import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // GET - Get all users
  if (req.method === "GET") {
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

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // POST - Create new user
  if (req.method === "POST") {
    try {
      const { username, email, password, full_name, role_id } = req.body;

      // Validation
      if (!username || !email || !password || !role_id) {
        return res.status(400).json({
          message: "Username, email, password, and role_id are required",
        });
      }

      // Check if username or email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Username or email already exists",
        });
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password_hash,
          full_name: full_name || null,
          role_id: parseInt(role_id),
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

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // PUT - Update user
  if (req.method === "PUT") {
    try {
      const { user_id, username, email, password, full_name, role_id } =
        req.body;

      // Validation
      if (!user_id) {
        return res.status(400).json({
          message: "user_id is required for update",
        });
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { user_id: parseInt(user_id) },
      });

      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check for duplicate username/email (excluding current user)
      if (username || email) {
        const duplicateUser = await prisma.user.findFirst({
          where: {
            AND: [
              { user_id: { not: parseInt(user_id) } },
              {
                OR: [
                  ...(username ? [{ username: username }] : []),
                  ...(email ? [{ email: email }] : []),
                ],
              },
            ],
          },
        });

        if (duplicateUser) {
          return res.status(409).json({
            message: "Username or email already exists",
          });
        }
      }

      // Prepare update data
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (full_name !== undefined) updateData.full_name = full_name;
      if (role_id) updateData.role_id = parseInt(role_id);

      // Hash new password if provided
      if (password) {
        const saltRounds = 10;
        updateData.password_hash = await bcrypt.hash(password, saltRounds);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: updateData,
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

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
