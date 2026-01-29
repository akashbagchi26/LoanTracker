export interface Borrower {
  _id: string;
  name: string;
  contact?: {
    phone_no?: number;
    email?: string;
  };
  loan_summery?: {
    active_loan: number;
    total_outstanding_amount: number;
    total_monthly_payment_due: number;
  };
}

export type CreateBorrower = Omit<Borrower, "_id"> & {
  user_id: string;
};
