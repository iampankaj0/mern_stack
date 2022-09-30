const express = require("express");
const productRoutes = require("./routes/productRoute"); /* import routes from productRoute */
const userRoutes = require("./routes/userRoute"); /* import routes from userRoute */
const orderRoutes = require("./routes/orderRoute"); /* import routes from orderRoute */
const paymentRoutes = require("./routes/paymentRoute"); /* import routes from paymentRoute */
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./moddleware/error");

// config dotenv file
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// Import Routes
app.use("/api", productRoutes);
app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for error
app.use(errorMiddleware);

module.exports = app;
