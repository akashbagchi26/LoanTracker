import Loan from "../models/Loan";
import Lent from "../models/Lent";

export async function updateLentOutstanding(lenderId: string) {
  const loans = await Loan.find({ lender_id: lenderId });

  const totalOutstanding = loans.reduce(
    (sum, loan) => sum + (loan.loan_amount_details?.total_outstanding || 0),
    0,
  );
  const activeLoan = loans.length;
  const totalMonthlyDue = loans.reduce(
    (sum, loan) => sum + (loan.repayment_details?.emi_amount || 0),
    0,
  );

  await Lent.findByIdAndUpdate(lenderId, {
    $set: {
      "loan_summery.total_outstanding_amount": totalOutstanding,
      "loan_summery.active_loan": activeLoan,
      "loan_summery.total_monthly_payment_due": totalMonthlyDue,
    },
  });
}
