import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/apiResponse.js";

import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
} from "../../services/review.service.js";

export const createReview =
  asyncHandler(async (req, res) => {
    const {
      productId,
      rating,
      comment,
    } = req.body;

    const review =
      await createReviewService(
        req.user._id,
        productId,
        rating,
        comment
      );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Review added successfully",
          review
        )
      );
  });

export const updateReview =
  asyncHandler(async (req, res) => {
    const { rating, comment } =
      req.body;

    const review =
      await updateReviewService(
        req.params.id,
        req.user._id,
        rating,
        comment
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Review updated successfully",
          review
        )
      );
  });

export const deleteReview =
  asyncHandler(async (req, res) => {
    await deleteReviewService(
      req.params.id,
      req.user
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Review deleted successfully"
        )
      );
  });