import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useLoanStore } from "@/store/useLoanStore";
import { createLoan } from "@/lib/api/loans";

export const useAddLoan = () => {
  const queryClient = useQueryClient();
  const { addLoan } = useLoanStore();

  return useMutation({
    mutationFn: createLoan,
    onSuccess: (newlyCreatedLoan) => {
      addLoan(newlyCreatedLoan);
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      router.replace("/(protected)/(tabs)/loan");
    },
    onError: (error) => {
      console.error("Failed to create loan:", error.message);
    },
  });
};
