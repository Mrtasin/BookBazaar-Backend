import { model, Schema } from "mongoose";
import { ArrayRating } from "../utils/constent.js";

const bookReviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      enum: ArrayRating,
      required: true,
    },

    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const BookReview = model("BookReview", bookReviewSchema);
export default BookReview;
