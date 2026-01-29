import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/dashboard";

export const useFetchStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => getDashboardStats(),
    placeholderData: (prev) => prev,
  });
};
