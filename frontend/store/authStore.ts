import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface AuthState {
  token: string | null;
  user: any | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setAuthToken: (data: { token: string; user: any }) => void;
  clearAuthToken: () => void;
  loadAuthToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  status: "loading",

  setAuthToken: async ({ token, user }) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ token, user, status: "authenticated" });
    } catch (e) {
      console.error("Failed to set auth token", e);
    }
  },

  clearAuthToken: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      set({ token: null, user: null, status: "unauthenticated" });
    } catch (e) {
      console.error("Failed to clear auth token", e);
    }
  },

  loadAuthToken: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userString = await SecureStore.getItemAsync(USER_KEY);

      if (token && userString) {
        set({ token, user: JSON.parse(userString), status: "authenticated" });
      } else {
        set({ status: "unauthenticated" });
      }
    } catch (e) {
      console.error("Failed to load auth token", e);
      set({ status: "unauthenticated" });
    }
  },
}));

export const { loadAuthToken } = useAuthStore.getState();

export default useAuthStore;
