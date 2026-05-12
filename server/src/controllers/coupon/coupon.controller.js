import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/apiResponse.js";

import {
  validateCouponService,
  createCouponService,
} from "../../services/coupon.service.js";

export const validateCoupon =
  asyncHandler(async (req, res) => {
    const { code, orderAmount } =
      req.body;

    const result =
      await validateCouponService(
        code,
        orderAmount
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Coupon applied successfully",
          result
        )
      );
  });

export const createCoupon =
  asyncHandler(async (req, res) => {
    const coupon =
      await createCouponService(
        req.body
      );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Coupon created successfully",
          coupon
        )
      );
  });