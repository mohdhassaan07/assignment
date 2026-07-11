import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { router as importRouter } from "./import/routes";
import { errors } from "./middleware/errors";
import { missing } from "./middleware/missing";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (_req, res) => {
  res.json({ message: "Backend is running", status: "OK" });
});

app.use("/api/v1/imports", importRouter);
app.use(missing);
app.use(errors);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

export default app;
