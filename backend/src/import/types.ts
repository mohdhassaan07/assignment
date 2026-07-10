import type { CRM_STATUSES, DATA_SOURCES } from "./constants";

export type CsvRow = Record<string, string>;

export interface NumberedRow {
  sourceRowNumber: number;
  values: CsvRow;
}

export type CrmStatus = (typeof CRM_STATUSES)[number];
export type DataSource = (typeof DATA_SOURCES)[number];

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
  crm_status: CrmStatus | "";
  crm_note: string;
  data_source: DataSource | "";
  possession_time: string;
  description: string;
}

export interface SkippedRecord {
  sourceRowNumber: number;
  reason: string;
}

export interface ImportResult {
  records: CrmRecord[];
  skippedRecords: SkippedRecord[];
  summary: {
    totalRows: number;
    imported: number;
    skipped: number;
  };
}
