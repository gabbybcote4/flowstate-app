import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'Lavender' | 'Mint' | 'Peach';
type FontSize = 'Small' | 'Medium' | 'Large';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  minimalMode: boolean;
  setMinimalMode: (enabled: boolean) => void;
  nudgesEnabled: boolean;
  setNudgesEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    gradient: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfig = {
  Lavender: {
    primary: '#a78bfa',
    primaryLight: '#ddd6fe',
    primaryDark: '#7c3aed',
    gradient: 'from-white to-lavender-50',
    gradientFrom: '#ffffff',
    gradientTo: '#f5f3ff',
  },
  Mint: {
    primary: '#34d399',
    primaryLight: '#a7f3d0',
    primaryDark: '#059669',
    gradient: 'from-white to-emerald-50',
    gradientFrom: '#ffffff',
    gradientTo: '#ecfdf5',
  },
  Peach: {
    primary: '#fb923c',
    primaryLight: '#fed7aa',
    primaryDark: '#ea580c',
    gradient: 'from-white to-orange-50',
    gradientFrom: '#ffffff',
    gradientTo: '#fff7ed',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('flowstate-theme');
    return (saved as Theme) || 'Lavender';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('flowstate-fontsize');
    return (saved as FontSize) || 'Medium';
  });

  const [minimalMode, setMinimalModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('flowstate-minimal');
    return saved === 'true';
  });

  const [nudgesEnabled, setNudgesEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('flowstate-nudges');
    return saved === null ? true : saved === 'true'; // Default to enabled
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('flowstate-darkmode');
    return saved === 'true';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('flowstate-theme', newTheme);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('flowstate-fontsize', size);
  };

  const setMinimalMode = (enabled: boolean) => {
    setMinimalModeState(enabled);
    localStorage.setItem('flowstate-minimal', enabled.toString());
  };

  const setNudgesEnabled = (enabled: boolean) => {
    setNudgesEnabledState(enabled);
    localStorage.setItem('flowstate-nudges', enabled.toString());
  };

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled);
    localStorage.setItem('flowstate-darkmode', enabled.toString());
  };

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = themeConfig[theme];
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-light', colors.primaryLight);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--gradient-from', colors.gradientFrom);
    root.style.setProperty('--gradient-to', colors.gradientTo);
    root.style.setProperty('--color-ring', colors.primary);
  }, [theme]);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    const sizeMap = {
      Small: '14px',
      Medium: '16px',
      Large: '18px',
    };
    root.style.setProperty('--base-font-size', sizeMap[fontSize]);
    root.style.fontSize = sizeMap[fontSize];
  }, [fontSize]);

  // Apply minimal mode
  useEffect(() => {
    const root = document.documentElement;
    if (minimalMode) {
      root.style.setProperty('--animate-duration-normal', '0ms');
      root.style.setProperty('--animate-duration-fast', '0ms');
      root.style.setProperty('--animate-duration-slow', '0ms');
      root.classList.add('minimal-mode');
    } else {
      root.style.setProperty('--animate-duration-normal', '200ms');
      root.style.setProperty('--animate-duration-fast', '150ms');
      root.style.setProperty('--animate-duration-slow', '300ms');
      root.classList.remove('minimal-mode');
    }
  }, [minimalMode]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        minimalMode,
        setMinimalMode,
        nudgesEnabled,
        setNudgesEnabled,
        darkMode,
        setDarkMode,
        themeColors: themeConfig[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
