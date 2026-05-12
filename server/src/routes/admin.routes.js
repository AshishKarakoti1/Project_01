import express from "express";

import protect from "../middleware/auth.middleware.js";

import authorizeRoles from "../middleware/role.middleware.js";

import {
  getDashboardAnalytics,
} from "../controllers/admin/admin.controller.js";

const router = express.Router();

router.use(protect);

router.use(
  authorizeRoles("admin")
);

router.get(
  "/dashboard",
  getDashboardAnalytics
);

export default router;