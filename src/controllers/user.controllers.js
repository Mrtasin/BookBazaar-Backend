import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fileUploader from "../utils/cloudinary.js";
import sendingEmail from "../utils/sendingMail.js";
import crypto from "crypto";

const userRegister = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if ([fullname, username, email, password].some((value) => !value))
    throw new ApiError(400, "All fields are required");

  if (await User.findOne({ $or: [{ email }, { username }] }))
    throw new ApiError(401, "User allready registerd");

  const avatarFilePath = req.file?.path;
  const response = await fileUploader(avatarFilePath);

  const newUser = await User.create({
    fullname,
    username,
    email,
    password,
    avatar: {
      url: response
        ? response.url
        : "https://placehold.co/600x400/orange/white",
    },
  });

  if (!newUser) throw new ApiError(500, "User not registerd");

  const token = await newUser.generateVerificationToken();

  const options = {
    name: fullname,
    subject: "Email Verification",
    email: email,
    url: `${process.env.BASE_URL}/api/v1/users/verify/${token}`,
  };

  await sendingEmail(options);

  newUser.password = undefined;

  res
    .status(201)
    .json(new ApiResponse(201, "User registerd successfully", newUser));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarFilePath = req.file?.path;
  if (!avatarFilePath) throw new ApiError(400, "Avatar file is required");

  const response = await fileUploader(avatarFilePath);
  if (!response) throw new ApiError(500, "Avatar not uploaded");

  const userId = req.user._id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: { url: response.url } },
    { new: true },
  ).select("-password -refershToken");

  res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully", updatedUser));
});

const verify = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) throw new ApiError(400, "Token is requried");

  const user = await User.findOneAndUpdate(
    {
      $and: [
        { verificationToken: token },
        { verificationExpiry: { $gte: Date.now() } },
      ],
    },
    {
      verificationExpiry: undefined,
      verificationToken: undefined,
      isVerified: true,
    },
    { new: true },
  ).select("-password");

  if (!user) throw new ApiError(401, "Token and expiry not matched");

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verification successfully", user));
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!(email || username) || !password)
    throw new ApiError(400, "All fields are required");

  const user = await User.findOne({ $or: [{ email }, { user }] });
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = user.isCorrectPassword(password);
  if (!isMatch)
    throw new ApiError(403, "Password is invalid", email ? email : username);

  const accessToken = user.generateAccessToken();
  const refershToken = user.generateRefershToken();

  await user.save();

  user.password = undefined;
  user.refershToken = undefined;

  res.cookie("accessToken", accessToken, {
    httpOnlt: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .cookie("refershToken", refershToken, {
      httpOnlt: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(ApiResponse(200, "User login successfully", user));
});

const userLogout = asyncHandler(async (req, res) => {
  res.cookie("accessToken", "");

  res
    .cookie("refershToken", "")
    .status(200)
    .json(ApiResponse(200, "User logout successfully", req.user.fullname));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email id is requried");

  const user = await User.findOne({ email }).select("-password -refershToken");
  if (!user) throw new ApiError(404, `${email} for this user not found`);

  const token = crypto.randomBytes(32).toString("hex");

  const updatedUser = await User.findByIdAndUpdate(
    User._id,

    {
      resetVerificationExpiry: Date.now() + 10 * 60 * 1000,
      resetVerificationToken: token,
    },

    { new: true },
  ).select("-password -refershToken");

  const options = {
    name: user.fullname,
    subject: "Reset Password",
    email: user.email,
    url: `${process.env.BASE_URL}/api/v1/users/reset-password/${token}`,
  };

  await sendingEmail(options);

  return res
    .status(200)
    .json(new ApiResponse(200, "Forgot password successfuly", updatedUser));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token || !password) new ApiError(400, "Password and token are required");

  const user = await findOneAndUpdate(
    {
      $and: [
        { resetVerificationToken: token },
        { resetVerificationExpiry: { $gte: Date.now() } },
      ],
    },

    {
      resetVerificationToken: undefined,
      resetVerificationExpiry: undefined,
      password,
    },

    { new: true },
  ).select("-password -refershToken");

  return res
    .status(200)
    .json(new ApiResponse(200, "Reset Password Successfully", user));
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password -refershToken");
  if (!user) throw new ApiError(401, "User not loggedin");

  return res
    .status(200)
    .json(ApiResponse(200, "Get profile successfully", user));
});

export {
  userRegister,
  updateAvatar,
  verify,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getProfile,
};
