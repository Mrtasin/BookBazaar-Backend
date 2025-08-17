import { model, Schema } from "mongoose";

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

    coverImage: {
      type: String,
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

const Book = model("Book", bookSchema);

export default Book;
