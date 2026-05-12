import Review from "../models/Review.js";

import Product from "../models/Product.js";

import ApiError from "../utils/ApiError.js";

const updateProductRatings =
  async (productId) => {
    const reviews =
      await Review.find({
        product: productId,
      });

    const totalReviews =
      reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce(
            (acc, review) =>
              acc + review.rating,
            0
          ) / totalReviews;

    await Product.findByIdAndUpdate(
      productId,
      {
        ratings: averageRating,
        numReviews: totalReviews,
      }
    );
  };

export const createReviewService =
  async (
    userId,
    productId,
    rating,
    comment
  ) => {
    const existingReview =
      await Review.findOne({
        user: userId,
        product: productId,
      });

    if (existingReview) {
      throw new ApiError(
        400,
        "You already reviewed this product"
      );
    }

    const review =
      await Review.create({
        user: userId,
        product: productId,
        rating,
        comment,
      });

    await updateProductRatings(
      productId
    );

    return review;
  };

export const updateReviewService =
  async (
    reviewId,
    userId,
    rating,
    comment
  ) => {
    const review =
      await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(
        404,
        "Review not found"
      );
    }

    if (
      review.user.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized access"
      );
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    await updateProductRatings(
      review.product
    );

    return review;
  };

export const deleteReviewService =
  async (reviewId, userId) => {
    const review =
      await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(
        404,
        "Review not found"
      );
    }

    if (
      review.user.toString() !==
        userId.toString() &&
      userId.role !== "admin"
    ) {
      throw new ApiError(
        403,
        "Unauthorized access"
      );
    }

    const productId = review.product;

    await review.deleteOne();

    await updateProductRatings(
      productId
    );
  };