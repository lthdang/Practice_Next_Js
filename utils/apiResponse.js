export const apiResponse = (
  res,
  statusCode,
  { status, message, data = null, error = null }
) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
    error,
  });
};
