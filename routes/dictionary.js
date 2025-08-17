import express from "express";
import { getWordDefinition } from "../controllers/directorycontrollers.js";

const router = express.Router();

// GET /api/dictionary/:word
router.get("/:word", getWordDefinition);

export default router;
