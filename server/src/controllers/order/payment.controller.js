import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/apiResponse.js";

import {
  createRazorpayOrderService,
  verifyPaymentService,
} from "../../services/payment.service.js";

export const createRazorpayOrder =
  asyncHandler(async (req, res) => {
    const razorpayOrder =
      await createRazorpayOrderService(
        req.params.orderId,
        req.user
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Razorpay order created",
          razorpayOrder
        )
      );
  });

export const verifyPayment =
  asyncHandler(async (req, res) => {
    const order =
      await verifyPaymentService(
        req.body
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Payment verified successfully",
          order
        )
      );
  });