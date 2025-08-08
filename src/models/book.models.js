import mongoose, { model, Schema } from "mongoose";
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 35,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 25,
    },

    description: {
      type: String,
      required: true,
    },

    book_no: {
      type: String,
      required: true,
      unique: true,
    },

    published_date: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock_quantity: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Book = model("Book", bookSchema);

export default Book;
