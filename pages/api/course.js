import { PrismaClient } from '@prisma/client';
import { apiResponse } from '../../utils/apiResponse';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      if (id) {
        const course = await prisma.course.findUnique({
          where: { course_id: parseInt(id) },
        });
        if (!course) {
          return apiResponse(res, 404, {
            status: 'error',
            message: `Course with ID ${id} not found`,
          });
        }
        return apiResponse(res, 200, {
          status: 'success',
          message: 'Course retrieved successfully',
          data: course,
        });
      }
      const courses = await prisma.course.findMany();
      if (!courses || courses.length === 0) {
        return apiResponse(res, 404, {
          status: 'error',
          message: 'No courses found',
        });
      }

      return apiResponse(res, 200, {
        status: 'success',
        message: 'Courses retrieved successfully',
        data: courses,
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, created_by_id, thumbnail_url } = req.body;

      // Validation
      if (!title || !description) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'Title and description are required',
        });
      }

      if (!created_by_id) {
        return apiResponse(res, 400, {
          status: 'error',
          message: 'created_by_id is required',
        });
      }

      // Check if user exists before creating course
      const userExists = await prisma.user.findUnique({
        where: { user_id: parseInt(created_by_id) },
      });

      if (!userExists) {
        return apiResponse(res, 404, {
          status: 'error',
          message: `User with ID ${created_by_id} not found`,
        });
      }

      const newCourse = await prisma.course.create({
        data: {
          title,
          description,
          created_by_id: parseInt(created_by_id),
          thumbnail_url: thumbnail_url || null,
        },
        include: {
          created_by: {
            select: {
              user_id: true,
              username: true,
              full_name: true,
            },
          },
        },
      });

      return apiResponse(res, 201, {
        status: 'success',
        message: 'Course created successfully',
        data: newCourse,
      });
    } catch (error) {
      console.error('Error creating course:', error);
      return apiResponse(res, 500, {
        status: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  return apiResponse(res, 405, {
    status: 'error',
    message: 'Method Not Allowed',
  });
}
