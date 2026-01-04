const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Order = require("./../models/order");
const OrderItem = require("./../models/orderItem");
const adminOnly = require("./../helpers/adminOnly");

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = req.query;
  const orders = await Order.find(filter)
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

router.post("/", async (req, res) => {
  const orderItemIds = await Promise.all(
    req.body.orderItems.map(async (item) => {
      const orderItem = new OrderItem({
        quantity: item.quantity,
        product: item.product,
      });
      await orderItem.save();
      return orderItem.id;
    })
  );

  const prices = await Promise.all(
    orderItemIds.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      return orderItem.quantity * orderItem.product.price;
    })
  );

  const totalPrice = prices.reduce((acc, cur) => acc + cur, 0);

  const order = new Order({
    orderItems: orderItemIds,
    shippingAddressOne: req.body.shippingAddressOne,
    shippingAddressTwo: req.body.shippingAddressTwo,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    totalPrice,
    user: req.user.id,
  });

  await order.save();

  res.status(200).json({
    status: "success",
    data: order,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      status: "fail",
      message: "no id found",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  const order = await Order.findById(id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: {
          path: "category",
        },
      },
    });

  if (!order)
    return res.status(404).json({
      status: "fail",
      message: "no order with that id",
    });

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

router.get("/get/count", async (req, res) => {
  const count = await Order.countDocuments();
  res.status(200).json({
    status: "success",
    data: {
      count,
    },
  });
});

router.get("/get/all/:user", async (req, res) => {
  const orders = await Order.find({ user: req.params.user })
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

router.use(adminOnly);

router.get("/get/salesOrder", async (req, res) => {
  const sales = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      sales: { ...sales.pop(), _id: undefined },
    },
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      status: "fail",
      message: "no id found",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({
      status: "fail",
      message: "invalid id",
    });

  const checkedOrder = await Order.findById(id);
  if (!checkedOrder)
    return res.status(404).json({
      status: "fail",
      message: "no order with that id",
    });

  const order = await Order.findByIdAndDelete(id);
  const orderItemIds = order.orderItems;
  await Promise.all(
    orderItemIds.map(async (orderItemId) => {
      await OrderItem.findByIdAndDelete(orderItemId);
    })
  );
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      status: "fail",
      message: "no id found",
    });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  const order = await Order.findById(id);
  if (!order)
    return res.status(404).json({
      status: "fail",
      message: "no order with that id",
    });
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      order: updatedOrder,
    },
  });
});

module.exports = router;
