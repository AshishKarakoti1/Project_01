import logger from "../utils/logger.js";

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  logger.error(err);

  res.status(statusCode).json({
    success: false,

    message,

    stack:
      process.env.NODE_ENV ===
      "development"
        ? err.stack
        : undefined,
  });
};

export default errorMiddleware;