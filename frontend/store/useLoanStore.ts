import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Loan = {
  id: string;
  lender_id: string;
  loan_type: string;
  loan_status: string;
  distribution_date: Date | null;
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
  rate_type: "simple" | "variable" | "";
  purpose: string;
};

type LoanStore = {
  loans: Loan[];
  isLoading: boolean;
  error: string | null;
  fetchLoans: () => Promise<void>;
  addLoan: (loan: any) => void;
};

const initialLoans: Loan[] = [
  {
    id: "loan-001",
    lender_id: "lender-001",
    loan_type: "Personal Loan",
    loan_status: "Active",
    distribution_date: new Date("2023-01-15"),
    principal_sanction: 50000,
    total_amount_paid: 15000,
    principal_outstanding: 35000,
    interest_outstanding: 2500,
    total_outstanding: 37500,
    repayment_type: "EMI",
    emi_amount: 4112,
    tenure_month: 12,
    emi_date: 1,
    rate_pa: 12.5,
    rate_type: "simple",
    purpose: "Home Renovation",
  },
  {
    id: "loan-002",
    lender_id: "lender-002",
    loan_type: "Car Loan",
    loan_status: "Active",
    distribution_date: new Date("2022-11-20"),
    principal_sanction: 800000,
    total_amount_paid: 350000,
    principal_outstanding: 450000,
    interest_outstanding: 45000,
    total_outstanding: 495000,
    repayment_type: "EMI",
    emi_amount: 15870,
    tenure_month: 60,
    emi_date: 1,
    rate_pa: 9.8,
    rate_type: "simple",
    purpose: "New car purchase",
  },
  {
    id: "loan-003",
    lender_id: "lender-003",
    loan_type: "Home Loan",
    loan_status: "Active",
    distribution_date: new Date("2021-05-10"),
    principal_sanction: 5000000,
    total_amount_paid: 1200000,
    principal_outstanding: 3800000,
    interest_outstanding: 325000,
    total_outstanding: 4125000,
    repayment_type: "EMI",
    emi_amount: 42500,
    tenure_month: 240,
    emi_date: 1,
    rate_pa: 8.5,
    rate_type: "variable",
    purpose: "Apartment purchase",
  },
  {
    id: "loan-004",
    lender_id: "lender-004",
    loan_type: "Education Loan",
    loan_status: "Paid Off",
    distribution_date: new Date("2018-08-01"),
    principal_sanction: 1000000,
    total_amount_paid: 1000000,
    principal_outstanding: 0,
    interest_outstanding: 0,
    total_outstanding: 0,
    repayment_type: "EMI",
    emi_amount: 12000,
    tenure_month: 120,
    emi_date: null,
    rate_pa: 10.2,
    rate_type: "simple",
    purpose: "Master's Degree",
  },
];

export const useLoanStore = create<LoanStore>()(
  persist(
    (set) => ({
      loans: [],
      isLoading: false,
      error: null,
      fetchLoans: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise<Loan[]>((resolve) =>
            setTimeout(() => resolve(initialLoans), 1000)
          );

          set({ loans: response, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch loans:", error);
          set({ error: "Failed to fetch loans", isLoading: false });
        }
      },
      addLoan: (loan) => {
        set((state) => ({
          loans: [...state.loans, loan],
        }));
      },
    }),
    {
      name: "loan-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ loans: state.loans }),
    }
  )
);
