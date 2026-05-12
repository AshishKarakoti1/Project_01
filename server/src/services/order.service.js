import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";

export const createOrderService = async (
  userId,
  shippingAddress,
  paymentMethod
) => {
  const user = await User.findById(userId)
    .populate("cart.product");

  if (!user.cart.length) {
    throw new ApiError(400, "Cart is empty");
  }

  let itemsPrice = 0;

  const orderItems = [];

  for (const item of user.cart) {
    const product = item.product;

    if (!product) {
      throw new ApiError(
        404,
        "Product no longer exists"
      );
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `${product.title} is out of stock`
      );
    }

    product.stock -= item.quantity;

    await product.save();

    const subtotal =
      item.price * item.quantity;

    itemsPrice += subtotal;

    orderItems.push({
      product: product._id,
      title: product.title,
      image:
        product.images?.[0]?.url || "",
      quantity: item.quantity,
      price: item.price,
    });
  }

  const shippingPrice =
    itemsPrice > 50000 ? 0 : 500;

  const taxPrice =
    Math.round(itemsPrice * 0.18);

  const totalPrice =
    itemsPrice +
    shippingPrice +
    taxPrice;

  const order = await Order.create({
    user: userId,

    orderItems,

    shippingAddress,

    paymentInfo: {
      method: paymentMethod,
    },

    itemsPrice,

    shippingPrice,

    taxPrice,

    totalPrice,
  });

  user.cart = [];

  await user.save();

  return order;
};

export const getMyOrdersService = async (
  userId
) => {
  const orders = await Order.find({
    user: userId,
  }).sort("-createdAt");

  return orders;
};

export const getSingleOrderService =
  async (orderId, user) => {
    const order =
      await Order.findById(orderId)
        .populate(
          "user",
          "name email"
        );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    const isOwner =
      order.user._id.toString() ===
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

    return order;
  };

export const updateOrderStatusService =
  async (orderId, status) => {
    const order =
      await Order.findById(orderId);

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    order.orderStatus = status;

    if (status === "DELIVERED") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    return order;
  };