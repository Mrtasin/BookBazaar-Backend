import { Router } from "express";
import isAdmin from "../middlewares/checkAdmin.middlewares.js";
import isLoggedIn from "../middlewares/user.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controllers.js";

const bookRoutes = Router();

bookRoutes
  .route("/add-book")
  .post(isLoggedIn, isAdmin, upload.single("coverImage"), addBook);

bookRoutes.route("/get-all-books").get(isLoggedIn, getAllBooks);

bookRoutes.route("/get-book/:id").get(isLoggedIn, getBookById);

bookRoutes.route("/update/:id").put(isLoggedIn, isAdmin, updateBook);

bookRoutes.route("/delete/:id").delete(isLoggedIn, isAdmin, deleteBook);

export default bookRoutes;
