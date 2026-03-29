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
      if (!token || !user) {
        console.warn("setAuthToken called with missing data", {
          token: !!token,
          user: !!user,
        });
      }

      const safeToken = token || "";
      const safeUserString = JSON.stringify(user || {});

      await SecureStore.setItemAsync(TOKEN_KEY, safeToken);
      await SecureStore.setItemAsync(USER_KEY, safeUserString);

      set({
        token: user ? safeToken : null,
        user: user || null,
        status: user ? "authenticated" : "unauthenticated",
      });
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

      if (
        token &&
        userString &&
        userString !== "undefined" &&
        userString !== "null"
      ) {
        try {
          const parsedUser = JSON.parse(userString);
          if (parsedUser && Object.keys(parsedUser).length > 0) {
            set({ token, user: parsedUser, status: "authenticated" });
            return;
          }
        } catch (parseError) {
          console.error("Failed to parse user from storage", parseError);
        }
      }

      set({ status: "unauthenticated", token: null, user: null });
    } catch (e) {
      console.error("Failed to load auth token from storage", e);
      set({ status: "unauthenticated", token: null, user: null });
    }
  },
}));

export const { loadAuthToken } = useAuthStore.getState();

export default useAuthStore;
