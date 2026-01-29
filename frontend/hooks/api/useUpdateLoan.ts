import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    },
  });
}
