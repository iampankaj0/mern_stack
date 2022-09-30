const productModel = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const asyncErrosFunction = require("../moddleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create New Product -- ADMIN_ROUTE
exports.createNewProduct = asyncErrosFunction(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const newProduct = await productModel.create(req.body);

  res.status(201).json({
    success: true,
    newProduct,
  });
});

// get all products
exports.getAllProducts = asyncErrosFunction(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await productModel.countDocuments();

  const apifeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const allProducts = await apifeature.query;
  res.status(200).json({
    success: true,
    allProducts,
    productsCount,
    resultPerPage,
  });
});

// get all products (ADMIN)
exports.getAdminProducts = asyncErrosFunction(async (req, res, next) => {
  const adminProducts = await productModel.find();

  res.status(200).json({
    success: true,
    adminProducts,
  });
});

// get product details by product id
exports.getProductDetails = asyncErrosFunction(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- ADMIN_ROUTE
exports.updateProduct = asyncErrosFunction(async (req, res, next) => {
  let product = await productModel.findById(
    req.params.id
  ); /*fetching the product id*/

  /* if product id not found*/
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // images start here
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    //delete previous images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  // if product is found then update it
  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product,
  });
});

// Delete the product
exports.deleteProduct = asyncErrosFunction(async (req, res, next) => {
  const product = await productModel.findById(
    req.params.id
  ); /*fetching the product id*/
  // if product is not found
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // Deleting Images form cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // if product id found
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Create and update the product review
exports.createProductReview = asyncErrosFunction(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.ratings =
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    }) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get all reviews of a product
exports.getProductReviews = asyncErrosFunction(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = asyncErrosFunction(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await productModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
