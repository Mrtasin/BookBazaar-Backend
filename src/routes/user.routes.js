import { Router } from "express";
import upload from "../middlewares/multer.middlewares.js";
import {
  forgotPassword,
  getProfile,
  resetPassword,
  updateAvatar,
  userLogin,
  userLogout,
  userRegister,
  verify,
} from "../controllers/user.controllers.js";
import isLoggedIn from "../middlewares/user.middlewares.js";

const userRoutes = Router();

userRoutes.route("/register").post(upload.single("avatar"), userRegister);

userRoutes.route("/login").post(userLogin);

userRoutes.route("/logout").get(isLoggedIn, userLogout);

userRoutes.route("/me").get(isLoggedIn, getProfile);

userRoutes.route("/verify/:token").post(verify);

userRoutes.route("/forgot-password").post(forgotPassword);

userRoutes.route("/reset-password/:token").post(resetPassword);

userRoutes
  .route("/update-avatar")
  .put(isLoggedIn, upload.single("avatar"), updateAvatar);

export default userRoutes;
