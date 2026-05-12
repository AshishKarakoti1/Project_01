import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
} from "../controllers/cart/cart.controller.js";

const router = express.Router();

router.use(protect);

router.post("/add", addToCart);

router.patch("/update", updateCartItem);

router.delete("/remove", removeCartItem);

router.get("/", getCart);

export default router;