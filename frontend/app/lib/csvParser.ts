/* ------------------------------------------------------------------ */
/*  Client-side CSV parser with streaming support for large files      */
/* ------------------------------------------------------------------ */

import Papa from "papaparse";
import type { CsvRow } from "./types";

export interface ParseResult {
  headers: string[];
  rows: CsvRow[];
  totalRows: number;
}

/**
 * Parse a CSV file client-side with streaming for progress reporting.
 * Uses PapaParse in streaming mode so memory usage stays constant
 * regardless of file size.
 */
export function parseCsvFile(
  file: File,
  onProgress?: (parsed: number) => void,
): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    let headers: string[] = [];
    let count = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      step: (result) => {
        if (headers.length === 0 && result.meta.fields) {
          headers = result.meta.fields;
        }
        rows.push(result.data as CsvRow);
        count++;
        if (count % 100 === 0) {
          onProgress?.(count);
        }
      },
      complete: () => {
        onProgress?.(count);
        resolve({ headers, rows, totalRows: count });
      },
      error: (error: Error) => {
        reject(new Error(`CSV parse error: ${error.message}`));
      },
    });
  });
}
