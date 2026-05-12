import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/apiResponse.js";

import {
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  getCartService,
} from "../../services/cart.service.js";

export const addToCart = asyncHandler(
  async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await addToCartService(
      req.user._id,
      productId,
      quantity
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Item added to cart",
          cart
        )
      );
  }
);

export const updateCartItem =
  asyncHandler(async (req, res) => {
    const { productId, quantity } =
      req.body;

    const cart =
      await updateCartItemService(
        req.user._id,
        productId,
        quantity
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Cart updated successfully",
          cart
        )
      );
  });

export const removeCartItem =
  asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const cart =
      await removeCartItemService(
        req.user._id,
        productId
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Item removed from cart",
          cart
        )
      );
  });

export const getCart = asyncHandler(
  async (req, res) => {
    const cart = await getCartService(
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Cart fetched successfully",
          cart
        )
      );
  }
);