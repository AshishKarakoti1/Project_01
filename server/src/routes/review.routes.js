import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review/review.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createReview);

router.patch("/:id", updateReview);

router.delete("/:id", deleteReview);

export default router;