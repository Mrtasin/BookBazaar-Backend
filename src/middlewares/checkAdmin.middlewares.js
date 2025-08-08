import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import { UserRoleEnum } from "../utils/constent.js";

const isAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = User.findOne({
    _id: userId,
    role: { $eq: UserRoleEnum.ADMIN },
  }).select("-password -refershToken");

  if (!user) throw new ApiError(403, "You can not perform this action", user);

  next();
});

export default isAdmin;
