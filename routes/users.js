const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const adminOnly = require("./../helpers/adminOnly");
const router = express.Router();

router.post("/", async (req, res) => {
  const checkedUser = await User.findOne({ email: req.body.email });
  if (checkedUser)
    return res
      .status(400)
      .json({ status: "fail", message: "email has been used before" });
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    country: req.body.country,
    zip: req.body.zip,
    phone: req.body.phone,
  });

  await user.save();
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      status: "success",
      message: "provide email and password",
    });
  const user = await User.findOne({ email });
  // if (!user)
  //   return res.status(404).json({ status: "fail", message: "incorrect email" });
  if (!user || !(await user.comparePassword(password, user.passwordHash))) {
    return res.status(400).json({
      status: "fail",
      message: "email or password is incorrect",
    });
  }
  const token = jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.SECRET,
    {
      expiresIn: process.env.EXPIRESIN,
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: "success",
    message: "login successfully",
    token,
  });
});

router.use(adminOnly);

router.get("/", async (req, res) => {
  const filter = req.query;
  const users = await User.find(filter).select("-passwordHash");
  res.status(200).send(users);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      status: "fail",
      message: "privide id for user",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id" });
  const user = await User.findById(id).select("-passwordHash");
  if (!user)
    return res
      .status(404)
      .json({ status: "fail", message: "no user found with id" });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      status: "fail",
      message: "privide id for user",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id" });
  const user = await User.findById(id);
  if (!user)
    return res
      .status(404)
      .json({ status: "fail", message: "no user found with id" });
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      country: req.body.country,
      zip: req.body.zip,
      phone: req.body.phone,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      status: "fail",
      message: "privide id for user",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid id" });
  const user = await User.findById(id);
  if (!user)
    return res
      .status(404)
      .json({ status: "fail", message: "no user found with id" });
  const deletedUser = await User.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    data: {
      user: deletedUser,
    },
  });
});

router.get("/get/count", async (req, res, next) => {
  const count = await User.countDocuments({ isAdmin: false });
  res.status(200).json({
    status: "success",
    data: {
      count,
    },
  });
});

module.exports = router;
