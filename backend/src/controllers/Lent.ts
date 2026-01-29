import { Request, Response } from "express";
import Lent from "../models/Lent";
import { updateLentOutstanding } from "../utils/updateLentSummary";
import mongoose from "mongoose";
import { AuthRequest } from "../types/AuthRequest";

// GET all lenders
export const getAllLents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User not found in token." });
    }

    const lents = await Lent.find({
      user_id: new mongoose.Types.ObjectId(userId),
    });

    res.json(lents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lents" });
  }
};

// GET lender by ID
export const getLentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid lender ID" });
    }

    const lent = await Lent.findById(id);
    if (!lent) return res.status(404).json({ error: "Lender not found" });

    res.json(lent);
  } catch (err) {
    console.error("getLentById error:", err);
    res.status(500).json({ error: "Error fetching lender" });
  }
};

// GET lender by Search
export const searchLents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { q } = req.query;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User not found in token." });
    }

    if (!q || typeof q !== "string" || q.trim() === "") {
      return res.status(400).json({ error: "Missing search query" });
    }

    const searchTerm = q.trim();

    const lents = await Lent.find({
      user_id: new mongoose.Types.ObjectId(userId),
      name: { $regex: searchTerm, $options: "i" },
    })
      .limit(20)
      .lean();

    res.json(lents);
  } catch (err) {
    console.error("searchLents error:", err);
    res.status(500).json({ error: "Error searching lenders" });
  }
};

// POST create lender
export const createBorrower = async (req: Request, res: Response) => {
  try {
    const { name, contact, user_id } = req.body;

    const newLent = new Lent({
      name,
      contact,
      user_id,
      loan_summery: {
        active_loan: 0,
        total_outstanding_amount: 0,
        total_monthly_payment_due: 0,
      },
    });

    const saved = await newLent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create lender" });
  }
};

// PUT update lender
export const updateLent = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };

    if (updateData.loan_summery) {
      delete updateData.loan_summery.active_loan;
      delete updateData.loan_summery.total_outstanding_amount;
      delete updateData.loan_summery.total_monthly_payment_due;
    }

    const updated = await Lent.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Lender not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update lender" });
  }
};

// DELETE lender
export const deleteLent = async (req: Request, res: Response) => {
  try {
    const deleted = await Lent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Lender not found" });

    res.json({ message: "Lender deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lender" });
  }
};

// POST manually refresh summary
export const refreshLoanSummary = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const lent = await Lent.findById(id);
    if (!lent) return res.status(404).json({ error: "Lender not found" });

    await updateLentOutstanding(id);
    const updated = await Lent.findById(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to refresh summary" });
  }
};
