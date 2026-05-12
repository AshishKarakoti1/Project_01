import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/order/payment.controller.js";

const router = express.Router();

router.use(protect);

router.post(
  "/create-order/:orderId",
  createRazorpayOrder
);

router.post(
  "/verify-payment",
  verifyPayment
);

export default router;