/**
 * Colors.ts - Premium Modern Theme
 */

const primary = "#6366f1"; // Indigo-500
const success = "#10b981"; // Emerald-500
const warning = "#f59e0b"; // Amber-500
const error = "#ef4444"; // Red-500

export const Colors = {
  light: {
    primary: "#6366f1",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    text: "#0f172a",
    secondaryText: "#64748b",
    background: "#ffffff",
    surface: "#f8fafc",
    border: "#e2e8f0",
    input: "#ffffff",
    tint: "#6366f1",
    icon: "#64748b",
    tabIconDefault: "#94a3b8",
    tabIconSelected: "#6366f1",
    card: "#ffffff",
    shadow: "#000000",
    headerBackground: "#ffffff",
  },
  dark: {
    primary: "#818cf8", // Vibrant Indigo
    success: "#34d399", // Emerald 400
    warning: "#fbbf24", // Amber 400
    error: "#f87171", // Red 400
    text: "#f8fafc", // Slate 50
    secondaryText: "#94a3b8", // Slate 400
    background: "#020617", // Slate 950 - Extremely Dark
    surface: "#0f172a", // Slate 900
    border: "#1e293b", // Slate 800
    input: "#1e293b",
    tint: "#818cf8",
    icon: "#94a3b8",
    tabIconDefault: "#475569",
    tabIconSelected: "#818cf8",
    card: "#0f172a", // Slate 900
    shadow: "#000000",
    headerBackground: "#020617",
  },
} as const;
