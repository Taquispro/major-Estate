import mongoose from "mongoose";

//creating rules or schema for users
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Model
const User = mongoose.model("User", userSchema); //.model("model name", schema)
export default User;
