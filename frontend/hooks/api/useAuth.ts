import { useMutation } from "@tanstack/react-query";
import { register, login } from "../../lib/api/auth";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      try {
        router.replace("/(auth)/login");
      } catch (error) {
        console.error("Failed to handle create account:", error);
      }
    },
    onError: (error) => {
      console.error("Register failed:", error);
    },
  });
};

// Hook to call login API and store token + user
export const useLogin = () => {
  const { setAuthToken } = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      try {
        await setAuthToken({ token: data.token, user: data.user });
        router.replace("/(protected)/(tabs)");
      } catch (error) {
        console.error("Failed to handle login success:", error);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Logout handler
export const useLogout = () => {
  const { clearAuthToken } = useAuthStore();

  return async () => {
    await clearAuthToken();
    router.replace("/(auth)/login");
  };
};

// Get auth state anywhere
export const useAuth = () => {
  return useAuthStore((state) => state);
};
