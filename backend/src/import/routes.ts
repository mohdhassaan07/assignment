import { Router } from "express";
import { upload } from "../middleware/upload";
import { createImport } from "./controller";

export const router = Router();

router.post("/", upload.single("file"), createImport);
