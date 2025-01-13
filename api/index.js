import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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
app.listen(3000, () => {
  console.log("Server is runnig at port 3000");
});
