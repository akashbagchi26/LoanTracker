import apiClient from "./client";

export const getDashboardStats = async () => {
  const response: any = await apiClient.get(`/dashboard/my-stats`);
  return response.data;
};
