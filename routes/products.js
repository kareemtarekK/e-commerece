const express = require("express");
const mongoose = require("mongoose");
const Product = require("./../models/product");
const router = express.Router();

router.get("/", async (req, res) => {
  const queryString = req.query;
  let filter = {};
  for (let key in queryString) {
    if (key === "category") {
      filter[key] = queryString[key].split(",");
    } else {
      filter[key] = queryString[key];
    }
  }
  const products = await Product.find(filter).populate({
    path: "category",
    select: "name icon color",
  });
  res.send(products);
});

router.post("/", async (req, res) => {
  const { category } = req.body;
  if (!mongoose.isValidObjectId(category)) {
    return res.status(400).json({ message: "invalid category id" });
  }
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  });
  await product.save();
  res.send(product);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: "provide id for product" });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id to get product" });
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name icon color",
  });
  if (!product)
    return res
      .status(404)
      .json({ message: "there is no product with that id" });
  res.status(200).json({ status: "success", data: { product } });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: "provide id for product" });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id to get product" });
  const product = await Product.findById(id);
  if (!product)
    return res
      .status(404)
      .json({ message: "there is no product with that id" });
  const { category } = req.body;
  if (!mongoose.isValidObjectId(category)) {
    return res.status(400).json({ message: "invalid category id" });
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      product: updatedProduct,
    },
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: "provide id for product" });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id to get product" });
  const product = await Product.findById(id);
  if (!product)
    return res
      .status(404)
      .json({ message: "there is no product with that id" });
  const deletedProduct = await Product.findByIdAndDelete(id);
  res
    .status(204)
    .json({ status: "success", data: { product: deletedProduct } });
});

router.get("/get/count", async (req, res) => {
  const count = await Product.countDocuments();
  res.status(200).json({
    status: "success",
    count,
  });
});

router.get("/get/featured", async (req, res) => {
  const count = req.query.count;
  let featuredProducts;
  if (count)
    featuredProducts = await Product.find({ isFeatured: true }).limit(+count);
  else featuredProducts = await Product.find({ isFeatured: true });
  res.status(200).json({
    status: "success",
    data: {
      featuredProducts,
    },
  });
});
module.exports = router;
