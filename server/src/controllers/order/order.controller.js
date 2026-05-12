import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/apiResponse.js";

import {
  createOrderService,
  getMyOrdersService,
  getSingleOrderService,
  updateOrderStatusService,
} from "../../services/order.service.js";

export const createOrder = asyncHandler(
  async (req, res) => {
    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    const order =
      await createOrderService(
        req.user._id,
        shippingAddress,
        paymentMethod
      );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Order placed successfully",
          order
        )
      );
  }
);

export const getMyOrders =
  asyncHandler(async (req, res) => {
    const orders =
      await getMyOrdersService(
        req.user._id
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Orders fetched successfully",
          orders
        )
      );
  });

export const getSingleOrder =
  asyncHandler(async (req, res) => {
    const order =
      await getSingleOrderService(
        req.params.id,
        req.user
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Order fetched successfully",
          order
        )
      );
  });

export const updateOrderStatus =
  asyncHandler(async (req, res) => {
    const order =
      await updateOrderStatusService(
        req.params.id,
        req.body.status
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Order updated successfully",
          order
        )
      );
  });