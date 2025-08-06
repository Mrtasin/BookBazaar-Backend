import { Router } from "express";
import upload from "../middlewares/multer.middlewares.js";
import { updateAvatar, userRegister } from "../controllers/user.controllers.js";
const userRoutes = Router();

userRoutes.route("/register").post(upload.single("avatar"), userRegister);
userRoutes.route("/update-avatar").post(upload.single("avatar"), updateAvatar);

export default userRoutes;
