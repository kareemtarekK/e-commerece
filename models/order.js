const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: [true, "select your order products"],
      },
    ],
    shippingAddressOne: String,
    shippingAddressTwo: String,
    city: String,
    zip: Number,
    country: String,
    phone: String,
    status: {
      type: String,
      default: "pending",
    },
    totalPrice: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dateOrdered: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
