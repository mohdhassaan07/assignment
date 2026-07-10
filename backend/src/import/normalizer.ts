import { CRM_STATUSES, DATA_SOURCES } from "./constants";
import type { ExtractedRecord } from "./schema";
import type {
  CrmRecord,
  CrmStatus,
  DataSource,
  SkippedRecord,
} from "./types";

interface NormalizedRecord {
  record: CrmRecord;
}

const text = (value: string | null | undefined): string =>
  (value ?? "").replace(/\r?\n/g, " ").trim();

export const normalizeRecord = (
  extracted: ExtractedRecord,
): NormalizedRecord | SkippedRecord => {
  const email = normalizeEmail(extracted.email);
  const mobile = normalizeMobile(extracted.mobile_without_country_code);

  if (!email && !mobile) {
    return {
      sourceRowNumber: extracted.sourceRowNumber,
      reason:
        text(extracted.skipReason) ||
        "Record has neither a valid email nor a mobile number.",
    };
  }

  const record: CrmRecord = {
    created_at: normalizeDate(extracted.created_at),
    name: text(extracted.name),
    email,
    country_code: normalizeCountryCode(extracted.country_code),
    mobile_without_country_code: mobile,
    company: text(extracted.company),
    city: text(extracted.city),
    state: text(extracted.state),
    country: text(extracted.country),
    lead_owner: text(extracted.lead_owner),
    crm_status: normalizeStatus(extracted.crm_status),
    crm_note: text(extracted.crm_note),
    data_source: normalizeSource(extracted.data_source),
    possession_time: text(extracted.possession_time),
    description: text(extracted.description),
  };

  return { record };
};

const normalizeEmail = (value: string | null | undefined): string => {
  const email = text(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};

const normalizeMobile = (value: string | null | undefined): string => {
  const mobile = text(value).replace(/\D/g, "");
  return mobile.length >= 7 ? mobile : "";
};

const normalizeCountryCode = (value: string | null | undefined): string => {
  const digits = text(value).replace(/\D/g, "");
  return digits ? `+${digits}` : "";
};

const normalizeDate = (value: string | null | undefined): string => {
  const date = text(value);
  return date && !Number.isNaN(new Date(date).getTime()) ? date : "";
};

const normalizeStatus = (
  value: string | null | undefined,
): CrmStatus | "" => {
  const status = text(value).toUpperCase();
  return CRM_STATUSES.includes(status as CrmStatus)
    ? (status as CrmStatus)
    : "";
};

const normalizeSource = (
  value: string | null | undefined,
): DataSource | "" => {
  const source = text(value).toLowerCase();
  return DATA_SOURCES.includes(source as DataSource)
    ? (source as DataSource)
    : "";
};
