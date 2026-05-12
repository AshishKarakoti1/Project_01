import express from "express";

import protect from "../middleware/auth.middleware.js";

import authorizeRoles from "../middleware/role.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createOrderSchema,
} from "../validations/order.validation.js";

import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/order/order.controller.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  validate(createOrderSchema),
  createOrder
);

router.get("/my", getMyOrders);

router.get("/:id", getSingleOrder);

router.patch(
  "/:id/status",
  authorizeRoles("admin"),
  updateOrderStatus
);

export default router;