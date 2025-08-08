import { model, Schema } from "mongoose";
import { ArrayUserRole, UserRoleEnum } from "../utils/constent.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://placehold.co/600x400/orange/white",
        localPath: "",
      },
    },

    fullname: {
      type: String,
      requried: true,
      trim: true,
      minlength: 3,
      maxlength: 25,
    },

    username: {
      type: String,
      requried: true,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 5,
      maxlength: 15,
    },

    email: {
      type: String,
      requried: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      requried: true,
      minlength: 8,
      maxlength: 32,
    },

    role: {
      type: String,
      enum: ArrayUserRole,
      default: UserRoleEnum.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refershToken: String,

    verificationToken: String,
    verificationExpiry: Date,

    resetVerificationToken: String,
    resetVerificationExpiry: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      email: this.email,
      username: this.username,
    },

    process.env.ACCESS_TOKEN_SECRET,

    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefershToken = function () {
  const token = jwt.sign(
    { _id: this._id },

    process.env.REFRESH_TOKEN_SECRET,

    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
  this.refershToken = token;
  return token;
};

userSchema.methods.generateVerificationToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 10 * 60 * 1000;

  this.verificationToken = token;
  this.verificationExpiry = expiry;

  await this.save();

  return token;
};

const User = model("User", userSchema);
export default User;
