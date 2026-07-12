import type { ApiResponse, ImportResult } from "./types";

const API_BASE = "https://assignment-89tf.onrender.com"
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1_000;

class ImportError extends Error {
  code: string;
  constructor(message: string, code = "UNKNOWN_ERROR") {
    super(message);
    this.name = "ImportError";
    this.code = code;
  }
}

/**
 * Sleep helper for back-off delays.
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Send a CSV file to the backend import endpoint.
 * Retries up to MAX_RETRIES times with exponential back-off on
 * network failures or 5xx responses.
 */
export async function importCsv(
  file: File,
  onRetry?: (attempt: number, maxRetries: number) => void,
): Promise<ImportResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/api/v1/imports`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const json = (await response.json()) as ApiResponse;
        if (json.success) {
          return json.data;
        }
        throw new ImportError("Unexpected response format", "BAD_RESPONSE");
      }

      /* Parse error body when available. */
      let errorMessage = `Server responded with ${response.status}`;
      let errorCode = "SERVER_ERROR";

      try {
        const errorJson = await response.json();
        if (errorJson?.error?.message) {
          errorMessage = errorJson.error.message;
          errorCode = errorJson.error.code ?? errorCode;
        }
      } catch {
        /* ignore parse failure */
      }

      /* Only retry on 5xx (server) errors. 4xx are client errors — don't retry. */
      if (response.status >= 500 && attempt < MAX_RETRIES) {
        lastError = new ImportError(errorMessage, errorCode);
        onRetry?.(attempt, MAX_RETRIES);
        await sleep(INITIAL_DELAY_MS * Math.pow(2, attempt - 1));
        continue;
      }

      throw new ImportError(errorMessage, errorCode);
    } catch (error) {
      if (error instanceof ImportError) {
        throw error;
      }

      /* Network error — retry. */
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < MAX_RETRIES) {
        onRetry?.(attempt, MAX_RETRIES);
        await sleep(INITIAL_DELAY_MS * Math.pow(2, attempt - 1));
        continue;
      }
    }
  }

  throw lastError ?? new ImportError("Import failed after retries", "MAX_RETRIES_EXCEEDED");
}
