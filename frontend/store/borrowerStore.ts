import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Borrower } from "@/types/borrower";

type LoanStore = {
  borrowers: Borrower[];
  isLoading: boolean;
  error: string | null;
  addBorrower: (loan: any) => void;
};

export const borrowerStore = create<LoanStore>()(
  persist(
    (set) => ({
      borrowers: [],
      isLoading: false,
      error: null,
      addBorrower: (borrower) => {
        set((state) => ({
          borrowers: [...state.borrowers, borrower],
        }));
      },
    }),
    {
      name: "loan-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ borrowers: state.borrowers }),
    },
  ),
);
