/* ------------------------------------------------------------------ */
/*  TypeScript interfaces mirroring the backend import types           */
/* ------------------------------------------------------------------ */

export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface SkippedRecord {
  sourceRowNumber: number;
  reason: string;
}

export interface ImportSummary {
  totalRows: number;
  imported: number;
  skipped: number;
}

export interface ImportResult {
  records: CrmRecord[];
  skippedRecords: SkippedRecord[];
  summary: ImportSummary;
}

export interface ApiResponse {
  success: boolean;
  data: ImportResult;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/** Row from the client-side CSV parse (preview step). */
export type CsvRow = Record<string, string>;

/** Application step states. */
export type AppStep = "idle" | "preview" | "processing" | "results";
