import { useColorScheme as useDeviceColorScheme } from "react-native";
import { useThemeStore } from "@/store/themeStore";

export function useColorScheme() {
  const deviceColorScheme = useDeviceColorScheme();
  const { theme } = useThemeStore();

  if (theme === "system") {
    return deviceColorScheme ?? "light";
  }

  return theme;
}
