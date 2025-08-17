import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Review from "../models/review.models.js";
import mongoose from "mongoose";

const addReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;

  const { bookId } = req.params;

  if (!comment || !rating || !bookId)
    throw new ApiError(400, "All fiealds are required");

  const review = await Review.create({
    comment,
    rating,
    bookId: new mongoose.Types.ObjectId(bookId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });
  if (!review) throw new ApiError(500, "Review is not create for some issue");

  return res
    .status(201)
    .json(new ApiResponse(201, "Review creating successfully", review));
});

const getAllReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  if (!bookId) throw new ApiError(400, "Book id is required");

  const allReviews = await Review.find({ bookId }).populate(
    "createdBy",
    "avatar fullname username",
  );
  if (!allReviews)
    throw new ApiError(404, `Not found reviews for this book id = ${bookId}`);

  return res
    .status(200)
    .json(new ApiResponse(200, "Get all reviews successfully", allReviews));
});

const deleteeReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Review id is required");

  const deletedReview = await Review.findOneAndDelete({
    $and: [
      { _id: new mongoose.Types.ObjectId(id) },
      { createdBy: new mongoose.Types.ObjectId(req.user._id) },
    ],
  });

  if (!deletedReview) throw new ApiError(500, "Review is not deleted");

  return res
    .status(200)
    .json(new ApiResponse(200, "Review deleted successfully", deletedReview));
});

export { addReview, getAllReviews, deleteeReview };
