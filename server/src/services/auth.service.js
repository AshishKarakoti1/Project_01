import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const registerUserService = async (data) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create(data);

  return user;
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  return user;
};