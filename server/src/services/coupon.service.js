import Coupon from "../models/Coupon.js";

import ApiError from "../utils/ApiError.js";

export const validateCouponService =
  async (code, orderAmount) => {
    const coupon =
      await Coupon.findOne({
        code: code.toUpperCase(),
      });

    if (!coupon) {
      throw new ApiError(
        404,
        "Coupon not found"
      );
    }

    if (!coupon.isActive) {
      throw new ApiError(
        400,
        "Coupon is inactive"
      );
    }

    if (
      new Date() > coupon.expiryDate
    ) {
      throw new ApiError(
        400,
        "Coupon has expired"
      );
    }

    if (
      coupon.usedCount >=
      coupon.usageLimit
    ) {
      throw new ApiError(
        400,
        "Coupon usage limit exceeded"
      );
    }

    if (
      orderAmount <
      coupon.minimumOrderAmount
    ) {
      throw new ApiError(
        400,
        `Minimum order amount is ₹${coupon.minimumOrderAmount}`
      );
    }

    let discountAmount = 0;

    if (
      coupon.discountType ===
      "PERCENTAGE"
    ) {
      discountAmount =
        (orderAmount *
          coupon.discountValue) /
        100;
    } else {
      discountAmount =
        coupon.discountValue;
    }

    return {
      coupon,
      discountAmount,
      finalAmount:
        orderAmount - discountAmount,
    };
  };

export const createCouponService =
  async (data) => {
    const coupon =
      await Coupon.create(data);

    return coupon;
  };