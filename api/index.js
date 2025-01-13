import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
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
//req ;- from cient to server
//res ;- from server to client
//after creating user.route.js file we can use app.use()
// app.get("/test", (req, res) => {
//   res.send("Hello world");
// });
app.use("/api/user", userRouter);
//it will give the response to api/user/test
