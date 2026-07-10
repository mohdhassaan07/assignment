import { extractRecords } from "../ai/groq";
import { createBatches } from "../shared/batch";
import { AppError } from "../shared/error";
import { BATCH_SIZE } from "./constants";
import { normalizeRecord } from "./normalizer";
import { parseCsv } from "./parser";
import type {
  CrmRecord,
  ImportResult,
  SkippedRecord,
} from "./types";

export const importCsv = async (file: Buffer): Promise<ImportResult> => {
  const rows = parseCsv(file);
  const batches = createBatches(rows, BATCH_SIZE);
  const extracted = [];

  // Sequential processing avoids sudden rate-limit spikes on smaller Groq plans.
  for (const batch of batches) {
    extracted.push(...(await extractRecords(batch)));
  }

  const expectedRows = new Set(rows.map((row) => row.sourceRowNumber));
  const returnedRows = new Set(extracted.map((row) => row.sourceRowNumber));
  const containsEveryRow = [...expectedRows].every((row) => returnedRows.has(row));

  if (
    extracted.length !== rows.length ||
    returnedRows.size !== rows.length ||
    !containsEveryRow
  ) {
    throw new AppError(
      502,
      "INCOMPLETE_AI_RESPONSE",
      "The AI service did not return every uploaded record.",
    );
  }

  const records: CrmRecord[] = [];
  const skippedRecords: SkippedRecord[] = [];

  for (const item of extracted) {
    const normalized = normalizeRecord(item);

    if ("record" in normalized) {
      records.push(normalized.record);
    } else {
      skippedRecords.push(normalized);
    }
  }

  return {
    records,
    skippedRecords,
    summary: {
      totalRows: rows.length,
      imported: records.length,
      skipped: skippedRecords.length,
    },
  };
};
