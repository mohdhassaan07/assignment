import Groq from "groq-sdk";
import { env } from "../config/env";
import { systemPrompt } from "../import/prompt";
import { extractionSchema, type ExtractedRecord } from "../import/schema";
import type { NumberedRow } from "../import/types";
import { AppError } from "../shared/error";
import { retry } from "../shared/retry";

const client = new Groq({ apiKey: env.GROQ_API_KEY });

export const extractRecords = async (
  rows: NumberedRow[],
): Promise<ExtractedRecord[]> =>
  retry(async () => {
    const completion = await client.chat.completions.create({
      model: env.GROQ_MODEL,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Extract these CSV records:\n${JSON.stringify(rows)}`,
        },
      ],
    });

    const content = completion.choices[0]?.message.content;

    if (!content) {
      throw new AppError(
        502,
        "EMPTY_AI_RESPONSE",
        "Groq returned an empty response.",
      );
    }

    try {
      const result: unknown = JSON.parse(content);
      return extractionSchema.parse(result).records;
    } catch {
      throw new AppError(
        502,
        "INVALID_AI_RESPONSE",
        "Groq returned an invalid extraction result.",
      );
    }
  });
