export interface LoanAmountDetails {
  principal_sanction: number;
  total_amount_paid: number;
  principal_outstanding: number;
  interest_outstanding: number;
  total_outstanding: number;
}

export interface RepaymentDetails {
  repayment_type: string;
  emi_amount: number;
  tenure_month: number;
  payment_made: number;
  payment_remaining: number;
  emi_date: number | null;
}

export interface InterestRateDetails {
  rate_pa: number;
  rate_type: string;
}

export interface Loan {
  _id: string;
  lender_id: string;
  loan_type: string;
  loan_status: string;
  distribution_date: string;
  loan_amount_details: LoanAmountDetails;
  repayment_details: RepaymentDetails;
  interest_rate_details: InterestRateDetails;
  purpose: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LoanFetchResponse {
  data: Loan[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateLoan {
  id: string;
  lender_id: string;
  loan_type: string;
  loan_status: string;
  distribution_date: string | null;
  principal_sanction: number;
  total_amount_paid: number;
  principal_outstanding: number;
  interest_outstanding: number;
  total_outstanding: number;
  repayment_type: string;
  emi_amount: number;
  tenure_month: number;
  emi_date: number | null;
  rate_pa: number;
  rate_type: "simple" | "variable";
  purpose: string;
}

export interface PrepayLoanResponse {
  success: boolean;
  message: string;
  data: Loan;
}
