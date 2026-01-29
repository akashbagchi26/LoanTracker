import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createBorrower } from "@/lib/api/borrower";
import { borrowerStore } from "@/store/borrowerStore";

export const useAddBorrower = () => {
  const queryClient = useQueryClient();
  const { addBorrower } = borrowerStore();

  return useMutation({
    mutationFn: createBorrower,
    onSuccess: (newlyCreatedBorrower) => {
      addBorrower(newlyCreatedBorrower);
      queryClient.invalidateQueries({ queryKey: ["borrowers"] });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to create loan:", error.message);
    },
  });
};
