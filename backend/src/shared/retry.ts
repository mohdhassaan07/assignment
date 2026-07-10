import { AppError } from "./error";

export const retry = async <T>(
  operation: () => Promise<T>,
  attempts = 3,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // A malformed response will not improve through an immediate retry.
      if (error instanceof AppError && error.code === "INVALID_AI_RESPONSE") {
        throw error;
      }

      if (attempt < attempts) {
        await delay(500 * 2 ** (attempt - 1));
      }
    }
  }

  if (lastError instanceof AppError) {
    throw lastError;
  }

  throw new AppError(
    502,
    "AI_SERVICE_ERROR",
    "The AI service is temporarily unavailable. Please try again.",
  );
};

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
