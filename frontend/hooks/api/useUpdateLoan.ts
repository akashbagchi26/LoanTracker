import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { updateLoan } from "@/lib/api/loans";

export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { loanId, ...body } = payload;
      return updateLoan(loanId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["loan"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      if (router.canGoBack()) {
        router.back();
      }
    },
    onError: (error: any) => {
      console.error("Failed to update loan:", error?.message || error);
    },
  });
}
