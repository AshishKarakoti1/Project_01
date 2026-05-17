import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardAnalyticsService =
  async () => {
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

    return {
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
  };