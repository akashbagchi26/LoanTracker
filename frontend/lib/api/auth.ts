import apiClient from "./client";

// Define the shape of your user and auth response
export interface User {
  id: string;
  name: string;
  email: string;
}

// Define the types for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: {
    email: string;
    id: string;
    name: string;
  };
}

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginData> => {
  const response = await apiClient.post("/users/login", credentials);
  const data = response.data.Data || response.data.data || response.data;

  // Normalize potentially capitalized keys
  return {
    token: data.token || data.Token,
    user: data.user || data.User,
  };
};

// You can add register, forgotPassword, etc. functions here as well
export const register = async (data: any) => {
  const response = await apiClient.post("/users/register", data);
  const resData = response.data.Data || response.data.data || response.data;
  return resData;
};
