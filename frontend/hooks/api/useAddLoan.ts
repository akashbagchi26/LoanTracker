import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useLoanStore } from "@/store/useLoanStore";
import { createLoan } from "@/lib/api/loans";

export const useAddLoan = () => {
  const queryClient = useQueryClient();
  const { addLoan } = useLoanStore();

  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] }); // Also refresh stats on dashboard
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(protected)/(tabs)/loan");
      }
    },
    onError: (error: any) => {
      console.error("Failed to create loan:", error?.message || error);
    },
  });
};
