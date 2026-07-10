import type { RequestHandler } from "express";

export const missing: RequestHandler = (_request, response) => {
  response.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "The requested API route does not exist.",
    },
  });
};
