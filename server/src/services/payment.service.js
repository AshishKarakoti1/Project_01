import crypto from "crypto";

import razorpay from "../config/razorpay.js";

import logger from "../utils/logger.js";

import Order from "../models/Order.js";

import ApiError from "../utils/ApiError.js";

export const createRazorpayOrderService =
  async (orderId, user) => {
    const order =
      await Order.findById(orderId);

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    const isOwner =
      order.user.toString() ===
      user._id.toString();

    if (
      !isOwner &&
      user.role !== "admin"
    ) {
      throw new ApiError(
        403,
        "Access denied"
      );
    }

    const options = {
      amount: order.totalPrice * 100,

      currency: "INR",

      receipt: order._id.toString(),
    };

    const razorpayOrder =
      await razorpay.orders.create(
        options
      );

    return razorpayOrder;
  };

export const verifyPaymentService =
  async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  }) => {
    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
            "|" +
            razorpay_payment_id
        )
        .digest("hex");

    const isAuthentic =
      generatedSignature ===
      razorpay_signature;

    if (!isAuthentic) {
      throw new ApiError(
        400,
        "Invalid payment signature"
      );
    }

    const order =
      await Order.findById(orderId);

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    order.paymentInfo.paymentStatus =
      "PAID";

    order.paymentInfo.transactionId =
      razorpay_payment_id;

    order.paymentInfo.razorpayOrderId =
      razorpay_order_id;

    order.paidAt = Date.now();

    order.orderStatus = "PROCESSING";

    await order.save();

    return order;
  };