import type { ThemeMode } from "../types";

export const darkColors = {
  background: "#000000",
  surface: "#111111",
  border: "#222222",
  text: "#FFFFFF",
  subtext: "#AAAAAA",
  primary: "#E5E5E5",
  danger: "#FF5A5F",
  success: "#5CFF5A",
};

export const lightColors = {
  background: "#FFFFFF",
  surface: "#F5F5F5",
  border: "#E5E5E5",
  text: "#111111",
  subtext: "#555555",
  primary: "#111111",
  danger: "#D32F2F",
  success: "#2E7D32",
};

export type ThemeColors = typeof darkColors;

export const getColors = (mode: ThemeMode): ThemeColors =>
  mode === "dark" ? darkColors : lightColors;
