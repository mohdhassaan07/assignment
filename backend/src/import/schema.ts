import { z } from "zod";

// AI output is untrusted input, so every field is accepted only as a string or null.
const value = z.string().nullable().optional();

export const extractedRecordSchema = z.object({
  sourceRowNumber: z.number().int().positive(),
  created_at: value,
  name: value,
  email: value,
  country_code: value,
  mobile_without_country_code: value,
  company: value,
  city: value,
  state: value,
  country: value,
  lead_owner: value,
  crm_status: value,
  crm_note: value,
  data_source: value,
  possession_time: value,
  description: value,
  skipReason: value,
});

export const extractionSchema = z.object({
  records: z.array(extractedRecordSchema),
});

export type ExtractedRecord = z.infer<typeof extractedRecordSchema>;
