import apiClient from "./client";
import { PrepayLoanResponse, CreateLoan } from "@/types/loan";

export type LoanForm = Omit<CreateLoan, "id">;

type UpdateLoanForm = Omit<CreateLoan, "id"> & {
  _id: string;
};

export const getLoans = async (filter: Record<string, any> = {}) => {
  const response = await apiClient.get("/loans", {
    params: filter,
  });

  const rawData = response.data.Data || response.data.data || response.data;
  return {
    loans: rawData.loans || rawData,
    pagination: rawData.pagination,
  };
};

export const getLoanById = async (id: string) => {
  const response: any = await apiClient.get(`/loans/${id}`);
  return response.data.Data || response.data.data || response.data;
};

export const createLoan = async (data: LoanForm): Promise<CreateLoan> => {
  const response = await apiClient.post("/loans", data);
  return response.data.Data || response.data.data || response.data;
};

export const updateLoan = async (
  loanId: string,
  data: LoanForm,
): Promise<UpdateLoanForm> => {
  const response = await apiClient.post(`/loans/${loanId}`, data);
  return response.data.Data || response.data.data || response.data;
};

export const prepayLoan = async (
  loanId: string,
  amount: number,
): Promise<PrepayLoanResponse> => {
  const response = await apiClient.post(`/loans/${loanId}/prepay`, { amount });
  return response.data.Data || response.data.data || response.data;
};
