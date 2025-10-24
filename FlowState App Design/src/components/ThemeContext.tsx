// src/components/ThemeContext.tsx
// manages global theme, font size, nudges, and dark mode state

import React, { createContext, useContext, useState, useEffect } from "react";

// theme + font size types
type Theme = "Lavender" | "Mint" | "Peach";
type FontSize = "Small" | "Medium" | "Large";

// full color model for theme objects
interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accentLight: string;
  gradientFrom: string;
  gradientTo: string;
  background: string;
  card: string;
  cardForeground: string; // text color on cards
  shadow: string; // shadow tint
}

// context value type
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  nudgesEnabled: boolean;
  setNudgesEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  themeColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// light theme color sets
const lightThemeConfig: Record<Theme, ThemeColors> = {
  Lavender: {
    primary: "#a78bfa",
    primaryLight: "#ddd6fe",
    primaryDark: "#7c3aed",
    accentLight: "#f5d0fe",
    background: "#faf9ff",
    card: "#ffffff",
    gradientFrom: "#faf9ff",
    gradientTo: "#f5f3ff",
    cardForeground: "#1f2937",
    shadow: "rgba(0,0,0,0.08)",
  },
  Mint: {
    primary: "#34d399",
    primaryLight: "#a7f3d0",
    primaryDark: "#059669",
    accentLight: "#bbf7d0",
    background: "#f9fffb",
    card: "#ffffff",
    gradientFrom: "#f9fffb",
    gradientTo: "#ecfdf5",
    cardForeground: "#1f2937",
    shadow: "rgba(0,0,0,0.08)",
  },
  Peach: {
    primary: "#fb923c",
    primaryLight: "#fed7aa",
    primaryDark: "#ea580c",
    accentLight: "#ffe4cc",
    background: "#fffaf6",
    card: "#ffffff",
    gradientFrom: "#fffaf6",
    gradientTo: "#fff7ed",
    cardForeground: "#1f2937",
    shadow: "rgba(0,0,0,0.08)",
  },
};

// dark theme color sets
const darkThemeConfig: Record<Theme, ThemeColors> = {
  Lavender: {
    primary: "#c4b5fd",
    primaryLight: "#a78bfa",
    primaryDark: "#6d28d9",
    accentLight: "#d8b4fe",
    background: "#0f172a",
    card: "#1e293b",
    gradientFrom: "#0f172a",
    gradientTo: "#0f172a",
    cardForeground: "#f1f5f9",
    shadow: "rgba(0,0,0,0.4)",
  },
  Mint: {
    primary: "#6ee7b7",
    primaryLight: "#34d399",
    primaryDark: "#065f46",
    accentLight: "#99f6e4",
    background: "#0f172a",
    card: "#1e293b",
    gradientFrom: "#0f172a",
    gradientTo: "#0f172a",
    cardForeground: "#f1f5f9",
    shadow: "rgba(0,0,0,0.4)",
  },
  Peach: {
    primary: "#fdba74",
    primaryLight: "#f97316",
    primaryDark: "#c2410c",
    accentLight: "#fed7aa",
    background: "#0f172a",
    card: "#1e293b",
    gradientFrom: "#0f172a",
    gradientTo: "#0f172a",
    cardForeground: "#f1f5f9",
    shadow: "rgba(0,0,0,0.4)",
  },
};

// provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("flowstate-theme");
    return (saved as Theme) || "Lavender";
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem("flowstate-fontsize");
    return (saved as FontSize) || "Medium";
  });

  const [nudgesEnabled, setNudgesEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem("flowstate-nudges");
    return saved === null ? true : saved === "true";
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem("flowstate-darkmode");
    return saved === "true";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("flowstate-theme", newTheme);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem("flowstate-fontsize", size);
  };

  const setNudgesEnabled = (enabled: boolean) => {
    setNudgesEnabledState(enabled);
    localStorage.setItem("flowstate-nudges", enabled.toString());
  };

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled);
    localStorage.setItem("flowstate-darkmode", enabled.toString());
  };

  useEffect(() => {
    const root = document.documentElement;
    const colors = darkMode ? darkThemeConfig[theme] : lightThemeConfig[theme];

    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-primary-light", colors.primaryLight);
    root.style.setProperty("--color-primary-dark", colors.primaryDark);
    root.style.setProperty("--color-accent-light", colors.accentLight);
    root.style.setProperty("--gradient-from", colors.gradientFrom);
    root.style.setProperty("--gradient-to", colors.gradientTo);
    root.style.setProperty("--color-ring", colors.primary);
    root.style.setProperty("--color-background", colors.background);
    root.style.setProperty("--color-card", colors.card);
    root.style.setProperty("--color-card-foreground", colors.cardForeground);
    root.style.setProperty(
      "--color-ring-offset-background",
      darkMode ? "#334155" : "#e5e7eb"
    );
  }, [theme, darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const sizeMap = {
      Small: "14px",
      Medium: "16px",
      Large: "18px",
    };
    root.style.setProperty("--base-font-size", sizeMap[fontSize]);
    root.style.fontSize = sizeMap[fontSize];
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const activeColors = darkMode
    ? darkThemeConfig[theme]
    : lightThemeConfig[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        nudgesEnabled,
        setNudgesEnabled,
        darkMode,
        setDarkMode,
        themeColors: activeColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// custom hook for easy access
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
