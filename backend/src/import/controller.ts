import type { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/error";
import { importCsv } from "./service";

export const createImport = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!request.file) {
      throw new AppError(
        400,
        "FILE_REQUIRED",
        'Upload a CSV file using the "file" form field.',
      );
    }

    const result = await importCsv(request.file.buffer);

    response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
