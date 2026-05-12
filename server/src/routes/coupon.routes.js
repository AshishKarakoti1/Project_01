import express from "express";

import protect from "../middleware/auth.middleware.js";

import authorizeRoles from "../middleware/role.middleware.js";

import {
  validateCoupon,
  createCoupon,
} from "../controllers/coupon/coupon.controller.js";

const router = express.Router();

router.post(
  "/validate",
  protect,
  validateCoupon
);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCoupon
);

export default router;