import apiClient from "./client";
import { Borrower, CreateBorrower } from "@/types/borrower";

export const getBorrower = async (): Promise<Borrower[]> => {
  const response = await apiClient.get<Borrower[]>("/lents");
  return response.data;
};

export const createBorrower = async (
  data: CreateBorrower
): Promise<Borrower> => {
  const response = await apiClient.post("/lents", data);
  return response.data;
};

export const searchBorrower = async (data: string): Promise<Borrower[]> => {
  const query = data.trim() ? data : '""';

  const response = await apiClient.get<Borrower[]>(
    `/lents/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};
