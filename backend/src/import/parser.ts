import { parse } from "csv-parse/sync";
import { AppError } from "../shared/error";
import { MAX_ROWS } from "./constants";
import type { CsvRow, NumberedRow } from "./types";

export const parseCsv = (file: Buffer): NumberedRow[] => {
  try {
    const records = parse(file, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: false,
    }) as CsvRow[];

    if (records.length === 0) {
      throw new AppError(400, "EMPTY_CSV", "The CSV file contains no data rows.");
    }

    if (records.length > MAX_ROWS) {
      throw new AppError(
        400,
        "TOO_MANY_ROWS",
        `A maximum of ${MAX_ROWS} rows can be imported at once.`,
      );
    }

    // CSV row one contains headers, so the first data record starts at row two.
    return records.map((values, index) => ({
      sourceRowNumber: index + 2,
      values: cleanRow(values),
    }));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      400,
      "INVALID_CSV",
      "The uploaded file is not a valid CSV file.",
    );
  }
};

const cleanRow = (row: CsvRow): CsvRow =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.trim(),
      String(value ?? "").trim(),
    ]),
  );
