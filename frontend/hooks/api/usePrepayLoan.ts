import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prepayLoan } from "@/lib/api/loans";

export function usePrepayLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { loanId, amount } = payload;
      return prepayLoan(loanId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["loan"] });
    },
  });
}
