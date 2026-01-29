import { Request, Response } from "express";
import mongoose from "mongoose";
import Loan from "../models/Loan";
import { updateLentOutstanding } from "../utils/updateLentSummary";
import { normalizeLoanPayload } from "../utils/normalizeLoanPayload";
import { AuthRequest } from "../types/AuthRequest";

/* -------------------- helpers -------------------- */
const getString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

/* =================================================
   GET ALL LOANS (ONLY LOGGED-IN USER)
================================================== */
export const getAllLoans = async (req: AuthRequest, res: Response) => {
  try {
    /* ---------- auth guard ---------- */
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = toObjectId(req.user.id);

    /* ---------- pagination ---------- */
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    /* ---------- query params ---------- */
    const loanType = getString(req.query.loan_type);
    const loanStatus = getString(req.query.loan_status);
    const purpose = getString(req.query.purpose);
    const startDate = getString(req.query.startDate);
    const endDate = getString(req.query.endDate);

    /* ---------- STRICT USER FILTER ---------- */
    const filter: Record<string, any> = {
      lender_id: userId,
    };

    /* ---------- optional filters ---------- */
    if (loanType) filter.loan_type = loanType;
    if (loanStatus) filter.loan_status = loanStatus;
    if (purpose) filter.purpose = { $regex: purpose, $options: "i" };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    /* ---------- db query ---------- */
    const [loans, total] = await Promise.all([
      Loan.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Loan.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: loans,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch loans",
    });
  }
};

/* =================================================
   GET LOAN BY ID (OWNERSHIP CHECK)
================================================== */
export const getLoanById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = toObjectId(req.user.id);

    const loan = await Loan.findOne({
      _id: req.params.id,
      lender_id: userId,
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loan" });
  }
};

/* =================================================
   CREATE LOAN
================================================== */
export const createLoan = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const normalizedLoan = normalizeLoanPayload({
      ...req.body,
      lender_id: req.user.id, // 🔒 force ownership
    });

    const newLoan = new Loan(normalizedLoan);
    const saved = await newLoan.save();

    await updateLentOutstanding(saved.lender_id.toString());

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};

/* =================================================
   UPDATE LOAN (OWNERSHIP CHECK)
================================================== */
export const updateLoan = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = toObjectId(req.user.id);
    const normalized = normalizeLoanPayload(req.body);

    const updated = await Loan.findOneAndUpdate(
      { _id: req.params.id, lender_id: userId },
      normalized,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Loan not found" });
    }

    await updateLentOutstanding(updated.lender_id.toString());

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};

/* =================================================
   DELETE LOAN (OWNERSHIP CHECK)
================================================== */
export const deleteLoan = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = toObjectId(req.user.id);

    const loan = await Loan.findOne({
      _id: req.params.id,
      lender_id: userId,
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    await loan.deleteOne();
    await updateLentOutstanding(loan.lender_id.toString());

    res.json({ message: "Loan deleted and summary updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete loan" });
  }
};

/* =================================================
   PREPAY LOAN (PARTIAL PAYMENT)
================================================== */
export const prepayLoan = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;
    const loanId = req.params.id;

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const loan = await Loan.findOne({
      _id: loanId,
      lender_id: toObjectId(req.user.id),
      loan_status: "active",
    });

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const { loan_amount_details, repayment_details, interest_rate_details } =
      loan;

    const rateType = interest_rate_details.rate_type;
    const annualRate = Number(interest_rate_details.rate_pa || 0);
    const emi = Number(repayment_details.emi_amount || 0);

    const principalAfter = Math.max(
      0,
      loan_amount_details.principal_outstanding - amount,
    );

    loan.loan_amount_details.principal_outstanding = principalAfter;

    const remainingMonths =
      emi > 0
        ? Math.ceil((loan_amount_details.total_outstanding - amount) / emi)
        : 0;

    let totalInterest = 0;

    if (
      repayment_details.repayment_type === "emi" &&
      remainingMonths > 0 &&
      principalAfter > 0
    ) {
      if (rateType === "simple") {
        totalInterest =
          principalAfter * (annualRate / 100) * (remainingMonths / 12);
      }

      if (rateType === "variable") {
        const monthlyRate = ((annualRate || 0) + 2) / 12 / 100;
        let outstanding = principalAfter;

        for (let i = 0; i < remainingMonths; i++) {
          if (outstanding <= 0) break;

          const interest = outstanding * monthlyRate;
          totalInterest += interest;

          const principalPart = emi - interest;
          if (principalPart <= 0) break;

          outstanding -= principalPart;
        }
      }
    }

    totalInterest = Math.max(0, Number(totalInterest.toFixed(2)));

    loan.loan_amount_details.interest_outstanding = totalInterest;

    loan.loan_amount_details.total_outstanding = Number(
      (principalAfter + totalInterest).toFixed(2),
    );

    loan.repayment_details.payment_made =
      (loan.repayment_details.payment_made || 0) + amount;

    loan.loan_amount_details.total_amount_paid += amount;

    loan.repayment_details.payment_remaining =
      loan.loan_amount_details.total_outstanding;

    if (loan.loan_amount_details.total_outstanding <= 0) {
      loan.loan_status = "closed";
      loan.loan_amount_details.principal_outstanding = 0;
      loan.loan_amount_details.interest_outstanding = 0;
      loan.loan_amount_details.total_outstanding = 0;
      loan.repayment_details.payment_remaining = 0;
    }

    await loan.save();

    return res.status(200).json({
      success: true,
      message: "Prepayment processed successfully",
      data: loan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
