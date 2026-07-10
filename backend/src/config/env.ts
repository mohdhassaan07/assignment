import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(4500),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  GROQ_MODEL: z.string().default("llama-3.3-70b-versatile"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  const messages = result.error.issues.map((issue) => issue.message).join(", ");
  throw new Error(`Invalid environment configuration: ${messages}`);
}

export const env = result.data;
