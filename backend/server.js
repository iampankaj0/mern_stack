const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught rejection`);
  process.exit(1);
});

// config dotenv file
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

/*  call connectDatabase function after configure .env
 *  file because mongodb URL is in .env file
 */
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});

// UNHANDLED PROMISE REJECTION
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
