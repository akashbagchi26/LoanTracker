import { useQuery } from "@tanstack/react-query";
import { getBorrower } from "@/lib/api/borrower";

const BORROW_QUERY_KEY = ["borrows"];

export const useFetchBorrower = () => {
  return useQuery({
    queryKey: BORROW_QUERY_KEY,
    queryFn: getBorrower,
  });
};
