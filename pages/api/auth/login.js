import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { apiResponse } from "../../../utils/apiResponse";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return apiResponse(res, 405, {
      status: "error",
      message: "Method Not Allowed",
    });
  }

  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return apiResponse(res, 400, {
        status: "error",
        message: "Username and password are required",
      });
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
        deleted_at: null, // Only active users
      },
      include: {
        role: {
          select: {
            role_id: true,
            role_name: true,
          },
        },
      },
    });

    if (!user) {
      return apiResponse(res, 401, {
        status: "error",
        message: "Invalid username or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return apiResponse(res, 401, {
        status: "error",
        message: "Invalid username or password",
      });
    }

    // Remove sensitive information
    const { password_hash, ...userWithoutPassword } = user;

    return apiResponse(res, 200, {
      status: "success",
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        redirectTo: user.role_id === 1 ? "/admin" : "/customer",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return apiResponse(res, 500, {
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
