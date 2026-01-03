const express = require("express");
const mongoose = require("mongoose");
const Category = require("./../models/category");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  await category.save();
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({
      message: "enter id for category",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id for category" });
  const category = await Category.findById(id);
  if (!category)
    return res
      .status(404)
      .json({ message: "there is no category with that id" });
  res.status(200).json({ category });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({
      message: "enter id for category",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id for category" });
  const category = await Category.findById(id);
  if (!category)
    return res
      .status(404)
      .json({ message: "there is no category with that id" });
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ status: "success", category: updatedCategory });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({
      message: "enter id for category",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id for category" });
  const category = await Category.findById(id);
  if (!category)
    return res
      .status(404)
      .json({ message: "there is no category with that id" });
  const deletedCategory = await Category.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
    data: {
      category: deletedCategory,
    },
  });
});

module.exports = router;
