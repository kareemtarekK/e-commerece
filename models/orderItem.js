const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: [true, "enter product quantity"],
      default: 0,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "enter product id"],
    },
  },
  { timestamps: true }
);

orderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderItemSchema.set("toJSON", {
  virtuals: true,
});
const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
