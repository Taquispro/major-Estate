import User from "../models/user.model.js";
import brcyptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = brcyptjs.hashSync(password, 10); //here 10 is number of rounds of encryption
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save(); //this will save the newuser inside the database. since it takes some time we use await
    res.status(201).json("User Created Successfully!");
  } catch (error) {
    next(error);
  }
};
