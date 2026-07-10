import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { AppError } from "../shared/error";

export const errors: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined && { details: error.details }),
      },
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    const isTooLarge = error.code === "LIMIT_FILE_SIZE";
    response.status(400).json({
      success: false,
      error: {
        code: isTooLarge ? "FILE_TOO_LARGE" : "UPLOAD_ERROR",
        message: isTooLarge
          ? "The CSV file must not exceed 10 MB."
          : error.message,
      },
    });
    return;
  }

  console.error("Unexpected error:", error);
  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};
