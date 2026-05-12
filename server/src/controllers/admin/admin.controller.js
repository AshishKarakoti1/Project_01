import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/apiResponse.js";

import {
  getDashboardAnalyticsService,
} from "../../services/admin.service.js";

export const getDashboardAnalytics =
  asyncHandler(async (req, res) => {
    const analytics =
      await getDashboardAnalyticsService();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Dashboard analytics fetched successfully",
          analytics
        )
      );
  });