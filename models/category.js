const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter category name"],
    },
    icon: String,
    color: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
