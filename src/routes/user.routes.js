import { Router } from "express";
import upload from "../middlewares/multer.middlewares.js";
const userRoutes = Router();

userRoutes.route("/register").post(upload.single("avatar"), userRegister);

export default userRoutes;
