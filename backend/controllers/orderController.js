const orderSchema = require("../models/orderModel");
const productSchema = require("../models/productModels");
const asyncErrosFunction = require("../moddleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

// Create Order
exports.newOrder = asyncErrosFunction(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderSchema.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = asyncErrosFunction(async (req, res, next) => {
  const order = await orderSchema
    .findById(req.params.id)
    .populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged In User Order
exports.myOrders = asyncErrosFunction(async (req, res, next) => {
  const orders = await orderSchema.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Order - admin
exports.getAllOrders = asyncErrosFunction(async (req, res, next) => {
  const orders = await orderSchema.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Order Status - admin
exports.updateOrder = asyncErrosFunction(async (req, res, next) => {
  const order = await orderSchema.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await productSchema.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// Delete Order
exports.deleteOrder = asyncErrosFunction(async (req, res, next) => {
  const order = await orderSchema.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
