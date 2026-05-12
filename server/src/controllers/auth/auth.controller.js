import crypto from "crypto";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/ApiError.js";

import sendToken from "../../utils/sendToken.js";

import User from "../../models/User.js";

import {
  registerUserService,
  loginUserService,
} from "../../services/auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);

  sendToken(user, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUserService(email, password);

  sendToken(user, 200, res);
});

export const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .json(new ApiResponse(200, "Logged out successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    resetToken,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or expired");
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});