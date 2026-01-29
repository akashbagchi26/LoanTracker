import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// GET all users
// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };

// GET user by ID
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      process.env.JWT_EXPIRATION
        ? { expiresIn: process.env.JWT_EXPIRATION }
        : undefined
    );

    res.status(200).json({
      Status: "Success",
      Data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email || "",
          name: user.name || "",
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// POST create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const hashedPw = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPw,
      user_loan_summery: {
        active_loan: 0,
        outstanding_amount: 0,
        payment_due: 0,
      },
    });

    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// PUT update user (excluding read-only fields)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };

    if (updateData.user_loan_summery) {
      delete updateData.user_loan_summery.active_loan;
      delete updateData.user_loan_summery.outstanding_amount;
      delete updateData.user_loan_summery.payment_due;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "User not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
