import path from "node:path";
import multer from "multer";
import { MAX_FILE_SIZE } from "../import/constants";
import { AppError } from "../shared/error";

const acceptedMimeTypes = new Set([
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "text/plain",
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    const hasCsvExtension =
      path.extname(file.originalname).toLowerCase() === ".csv";

    if (!hasCsvExtension || !acceptedMimeTypes.has(file.mimetype)) {
      callback(
        new AppError(
          415,
          "INVALID_FILE_TYPE",
          "Only valid CSV files are supported.",
        ),
      );
      return;
    }

    callback(null, true);
  },
});
