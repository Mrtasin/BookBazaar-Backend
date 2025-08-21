import { model, Schema } from "mongoose";
import { ArrayOrderStatus, orderStatus } from "../utils/constent.js";

const orderItemSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ArrayOrderStatus,
      default: orderStatus.PENDING,
      required: true,
    },
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    paymentDetails: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);
const Order = model("Order", orderSchema);

export default Order;
