import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) throw new ApiError(401, "User not loggedin");

  const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!user) throw new ApiError(401, "User not loggedin");

  req.user = user;

  next();
});

export default isLoggedIn;
