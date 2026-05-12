import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

import { setCache, getCache } from "../utils/cache.js";

export const getDashboardAnalyticsService =
  async () => {
    const cacheKey =
      "admin:dashboard";

    const cachedAnalytics =
      await getCache(cacheKey);

    if (cachedAnalytics) {
      return cachedAnalytics;
    }

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueData,
      recentOrders,
      lowStockProducts,
      topSellingProducts,
      monthlySales,
    ] = await Promise.all([
      User.countDocuments(),

      Product.countDocuments(),

      Order.countDocuments(),

      Order.aggregate([
        {
          $match: {
            "paymentInfo.paymentStatus":
              "PAID",
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum:
                "$totalPrice",
            },
          },
        },
      ]),

      Order.find()
        .lean()
        .sort("-createdAt")
        .limit(5)
        .populate(
          "user",
          "name email"
        ),

      Product.find({
        stock: {
          $lt: 5,
        },
      })
        .lean()
        .select(
          "title stock category"
        ),

      Order.aggregate([
        {
          $unwind:
            "$orderItems",
        },

        {
          $group: {
            _id:
              "$orderItems.product",

            totalSold: {
              $sum:
                "$orderItems.quantity",
            },
          },
        },

        {
          $sort: {
            totalSold: -1,
          },
        },

        {
          $limit: 5,
        },

        {
          $lookup: {
            from: "products",

            localField: "_id",

            foreignField:
              "_id",

            as: "product",
          },
        },

        {
          $unwind: "$product",
        },
      ]),

      Order.aggregate([
        {
          $match: {
            "paymentInfo.paymentStatus":
              "PAID",
          },
        },

        {
          $group: {
            _id: {
              month: {
                $month:
                  "$createdAt",
              },

              year: {
                $year:
                  "$createdAt",
              },
            },

            revenue: {
              $sum:
                "$totalPrice",
            },

            orders: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const result = {
      overview: {
        totalUsers,

        totalProducts,

        totalOrders,

        totalRevenue:
          revenueData[0]
            ?.totalRevenue || 0,
      },

      recentOrders,

      lowStockProducts,

      topSellingProducts,

      monthlySales,
    };

    await setCache(
      cacheKey,
      result,
      300
    );

    return result;
  };