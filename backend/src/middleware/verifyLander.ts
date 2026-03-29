import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Lent from "../models/Lent";
import { AuthRequest } from "../types/AuthRequest";

export const verifyLanderOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No token provided." });
    }

    // Fetch only the lender IDs belonging to this user
    const lenders = await Lent.find(
      { user_id: new mongoose.Types.ObjectId(userId) },
      { _id: 1 }, // only return _id field
    ).lean();

    if (!lenders.length) {
      return res.status(404).json({ error: "No lenders found" });
    }

    // Extract just the IDs into an array
    req.lenderIds = lenders.map((l) => l._id.toString());

    next();
  } catch (error) {
    console.error("verifyLanderOwner error:", error);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};
