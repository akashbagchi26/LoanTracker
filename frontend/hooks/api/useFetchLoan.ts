import { useQuery } from "@tanstack/react-query";
import { getLoanById, getLoans } from "@/lib/api/loans";

export const useFetchLoans = (filter: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["loans", filter],
    queryFn: () => getLoans(filter),
    placeholderData: (prev) => prev,
  });
};

export const useFetchLoanById = (loanId: string | undefined) => {
  return useQuery({
    queryKey: ["loan", loanId],
    queryFn: () => getLoanById(loanId!),
    enabled: !!loanId,
  });
};
