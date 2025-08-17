import { Router } from "express";
import {
  addReview,
  deleteeReview,
  getAllReviews,
} from "../controllers/review.controllers.js";
import isLoggedIn from "../middlewares/user.middlewares.js";

const reviewRoutes = Router();

reviewRoutes.route("/add-review/:bookId").post(isLoggedIn, addReview);

reviewRoutes.route("/get-all/:bookId").get(isLoggedIn, getAllReviews);

reviewRoutes.route("/delete/:id").delete(isLoggedIn, deleteeReview);

export default reviewRoutes;
