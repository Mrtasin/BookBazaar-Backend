import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fileUploader from "../utils/cloudinary.js";
import sendingEmail from "../utils/sendingMail.js";

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
  if (!avatarFilePath) throw new ApiError(400, "Avatar is requried");

  const response = fileUploader(avatarFilePath)
  .catch((err) => {
    throw new ApiError(500, "File uploading error :-", err.message);
  });

  console.log(response)

  return res.status(200).json(
    new ApiResponse(200, "Avatar Uploaded Successfully")
  )
});

export { userRegister, updateAvatar };
