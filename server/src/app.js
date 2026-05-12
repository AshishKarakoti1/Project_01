import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xssClean from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import logger from "./utils/logger.js";

import requestTimeLogger from "./middleware/requestTime.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import swaggerSpec from "./docs/swagger.js";

const app = express();

app.use(compression());

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  morgan("combined", {
    stream: {
      write: (message) =>
        logger.info(message.trim()),
    },
  })
);

app.use(requestTimeLogger);

app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(hpp());

app.use(xssClean());

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.use("/api/auth", authRoutes);

app.use(
  "/api/products",
  productRoutes
);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/coupons",
  couponRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Furniture API Running",
  });
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/error", () => {
  throw new Error("Test Error");
});

app.get("/crash", () => {
  throw new Error(
    "Production crash test"
  );
});

app.use(errorMiddleware);

export default app;