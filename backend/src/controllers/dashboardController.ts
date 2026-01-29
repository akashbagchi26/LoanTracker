import { Response } from "express";
import mongoose from "mongoose";
import Loan from "../models/Loan";
import { AuthRequest } from "../types/AuthRequest";

export const getMyDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Get UserID from the Bearer Token
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const stats = await Loan.aggregate([
      {
        // 2. Filter: Only loans where THIS user is the lender_id
        $match: {
          lender_id: new mongoose.Types.ObjectId(userId),
          loan_status: { $in: ["active", "closed"] },
        },
      },
      {
        // 3. Group and Sum values from your LoanAmountDetailsSchema
        $group: {
          _id: null,
          totalLent: { $sum: "$loan_amount_details.principal_sanction" },
          totalDuePayments: { $sum: "$loan_amount_details.total_outstanding" },

          // Track unique profiles linked to these loans
          uniqueProfiles: { $addToSet: "$lender_id" },

          // Interest Earned Logic
          totalPaid: { $sum: "$loan_amount_details.total_amount_paid" },
          totalPrincipalSanction: {
            $sum: "$loan_amount_details.principal_sanction",
          },
          totalPrincipalOutstanding: {
            $sum: "$loan_amount_details.principal_outstanding",
          },
        },
      },
      {
        // 4. Project final formatted fields
        $project: {
          _id: 0,
          totalLent: 1,
          totalDuePayments: 1,
          totalBorrower: { $size: "$uniqueProfiles" },
          totalInterestEarned: {
            $subtract: [
              "$totalPaid",
              {
                $subtract: [
                  "$totalPrincipalSanction",
                  "$totalPrincipalOutstanding",
                ],
              },
            ],
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalLent: 0,
      totalBorrower: 0,
      totalInterestEarned: 0,
      totalDuePayments: 0,
    };

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
