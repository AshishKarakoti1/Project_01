import User from "../models/User.js";
import Product from "../models/Product.js";

import ApiError from "../utils/ApiError.js";

export const addToCartService = async (
  userId,
  productId,
  quantity
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(
      400,
      "Insufficient stock available"
    );
  }

  const user = await User.findById(userId);

  const existingCartItem = user.cart.find(
    (item) =>
      item.product.toString() ===
      productId.toString()
  );

  if (existingCartItem) {
    existingCartItem.quantity += quantity;

    if (
      existingCartItem.quantity > product.stock
    ) {
      throw new ApiError(
        400,
        "Stock limit exceeded"
      );
    }
  } else {
    user.cart.push({
      product: product._id,
      quantity,
      price: product.discountPrice || product.price,
    });
  }

  await user.save();

  return user.cart;
};

export const updateCartItemService = async (
  userId,
  productId,
  quantity
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity > product.stock) {
    throw new ApiError(
      400,
      "Requested quantity exceeds stock"
    );
  }

  const user = await User.findById(userId);

  const cartItem = user.cart.find(
    (item) =>
      item.product.toString() ===
      productId.toString()
  );

  if (!cartItem) {
    throw new ApiError(
      404,
      "Cart item not found"
    );
  }

  cartItem.quantity = quantity;

  cartItem.price =
    product.discountPrice || product.price;

  await user.save();

  return user.cart;
};

export const removeCartItemService =
  async (userId, productId) => {
    const user = await User.findById(userId);

    user.cart = user.cart.filter(
      (item) =>
        item.product.toString() !==
        productId.toString()
    );

    await user.save();

    return user.cart;
  };

export const getCartService = async (
  userId
) => {
  const user = await User.findById(userId)
    .populate(
      "cart.product",
      "title price discountPrice images stock"
    );

  let totalAmount = 0;

  const cartItems = user.cart.map((item) => {
    const subtotal =
      item.price * item.quantity;

    totalAmount += subtotal;

    return {
      ...item.toObject(),
      subtotal,
    };
  });

  return {
    cartItems,
    totalAmount,
  };
};