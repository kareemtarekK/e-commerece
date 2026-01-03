const mongoose = require("mongoose");
const { ref } = require("process");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter name of product"],
    },
    description: {
      type: String,
      required: [true, "enter description of product"],
    },
    richDescription: String,
    image: {
      type: String,
      required: [true, "enter image of product"],
    },
    images: [
      {
        type: String,
      },
    ],
    brand: String,
    price: {
      type: Number,
      required: [true, "enter price of product"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "enter category of product"],
    },
    countInStock: {
      type: Number,
      required: [true, "enter count in stock of product"],
      min: 0,
      max: 500,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
