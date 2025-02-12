import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  }); //mongoose.connect("application string from the mongodb website")

const app = express();

//To enable the serbr to accept json we use app.use(express.json())
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log("Server is runnig at port 3000");
});
//req ;- from cient to server
//res ;- from server to client
//after creating user.route.js file we can use app.use()
// app.get("/test", (req, res) => {
//   res.send("Hello world");
// });
app.use("/api/user", userRouter);
//it will give the response to api/user/test

//signup route
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

//error handling middleware
app.use((err, req, res, next) => {
  //err is the error ivoked
  //req is he request
  //res is the response
  //next determines the next middleware to be excuted
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
