import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Book from "../models/book.models.js";
import fileUploader from "../utils/cloudinary.js";

const addBook = asyncHandler(async (req, res) => {
  const { title, author, description, price, quantity, published_date } =
    req.body;

  if (
    [title, author, description, price, quantity, published_date].some(
      (value) => !value,
    )
  )
    throw new ApiError(400, "All fields are required");

  const coverImageLocalPath = req.file.path;
  if (!coverImageLocalPath) throw new ApiError(400, "CoverImage is required");

  const response = await fileUploader(coverImageLocalPath);

  if (!response) throw new ApiError(500, "Book not created");

  const newBook = await Book.create({
    title,
    author,
    description,
    price,
    stock_quantity: quantity,
    published_date,
    coverImage: response.url,
    createdBy: req.user._id,
  });

  if (!newBook) throw new ApiError(500, "Book not created");

  return res
    .status(201)
    .json(new ApiResponse(201, "Book created successfully", newBook));
});

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate("createdBy", "fullname email role");

  if (!books) throw new ApiError(404, "No books found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Books fetched successfully", books));
});

const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Book Id is required");

  const book = await Book.findById(id).populate(
    "createdBy",
    "fullname email role",
  );
  if (!book) throw new ApiError(404, "Book not found by this Id");

  return res
    .status(200)
    .json(new ApiResponse(200, "Book fetched by Id successfully", book));
});

const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Book Id is required");

  const { title, author, description, price, quantity, published_date } =
    req.body;

  const book = await Book.findByIdAndUpdate(
    id,
    {
      title,
      author,
      description,
      price,
      stock_quantity: quantity,
      published_date,
      createdBy: req.user._id,
    },
    { new: true },
  );

  if (!book) throw new ApiError(500, "Book not updated");

  return res
    .status(200)
    .json(new ApiResponse(200, "Book updated successfully", book));
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Book Id is required");

  const deletedBook = await Book.findByIdAndDelete(id);
  if (!deletedBook) throw new ApiError(500, "Book not deleted");

  return res
    .status(200)
    .json(new ApiResponse(200, "Book deleted successfully", deletedBook));
});

export { addBook, getAllBooks, getBookById, updateBook, deleteBook };
