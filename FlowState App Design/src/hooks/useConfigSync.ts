import { useEffect, useRef } from 'react';
import { useUserConfig } from '../config/UserConfigContext';
import { useTheme } from '../components/context/ThemeContext';

/**
 * Hook to synchronize UserConfig with ThemeContext and apply configuration on app load
 * This ensures that all onboarding selections are properly applied throughout the app
 * Only syncs ONCE on initial load to avoid overriding manual user changes in Settings
 */
export function useConfigSync() {
  const { config } = useUserConfig();
  const { setTheme, setFontSize, setMinimalMode, setDarkMode } = useTheme();
  const hasInitialized = useRef(false);

  // Sync theme settings from config to ThemeContext
  // Only run ONCE on initial load to avoid overriding manual Settings changes
  useEffect(() => {
    // Skip if already initialized
    if (hasInitialized.current) {
      return;
    }

    console.log('🔄 useConfigSync running (initial sync only)...', {
      onboardingCompleted: config.onboardingCompleted,
      themeMode: config.theme.mode,
      primaryColor: config.theme.primaryColor,
      fontSize: config.theme.fontSize,
    });

    // Check if user has manually changed settings in ThemeContext
    // If localStorage has explicit overrides, respect those instead of config
    const manualDarkMode = localStorage.getItem('flowstate-darkmode');
    const manualMinimalMode = localStorage.getItem('flowstate-minimal');
    const manualFontSize = localStorage.getItem('flowstate-fontsize');
    const manualTheme = localStorage.getItem('flowstate-theme');

    // Apply dark mode (check for manual override first)
    if (manualDarkMode !== null) {
      // User has manually set dark mode in Settings, respect that
      setDarkMode(manualDarkMode === 'true');
      if (manualMinimalMode !== null) {
        setMinimalMode(manualMinimalMode === 'true');
      }
    } else {
      // No manual override, apply from config
      switch (config.theme.mode) {
        case 'light':
          setDarkMode(false);
          setMinimalMode(false);
          break;
        case 'dark':
          setDarkMode(true);
          setMinimalMode(false);
          break;
        case 'minimal':
          setDarkMode(false);
          setMinimalMode(true);
          break;
        case 'auto':
          // Detect system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setDarkMode(prefersDark);
          setMinimalMode(false);
          break;
      }
    }

    // Apply primary color (check for manual override first)
    if (manualTheme !== null) {
      // User has manually selected a theme in Settings
      setTheme(manualTheme as 'Lavender' | 'Mint' | 'Peach');
    } else {
      // Apply primary color to ThemeContext
      // Map hex colors to theme names
      const colorToThemeMap: Record<string, 'Lavender' | 'Mint' | 'Peach'> = {
        '#A78BFA': 'Lavender',
        '#C084FC': 'Lavender',
        '#FBCFE8': 'Lavender',
        '#FED7AA': 'Peach',
        '#A7F3D0': 'Mint',
        '#93C5FD': 'Lavender',
      };

      const themeName = colorToThemeMap[config.theme.primaryColor] || 'Lavender';
      setTheme(themeName);
    }

    // Apply font size (check for manual override first)
    if (manualFontSize !== null) {
      // User has manually changed font size in Settings
      setFontSize(manualFontSize as 'Small' | 'Medium' | 'Large');
    } else {
      const fontSizeMap = {
        small: 'Small' as const,
        medium: 'Medium' as const,
        large: 'Large' as const,
      };
      setFontSize(fontSizeMap[config.theme.fontSize]);
    }

    // Apply custom primary color to CSS variables directly
    // This overrides the ThemeContext's color with the exact user selection
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.theme.primaryColor);
    root.style.setProperty('--color-ring', config.theme.primaryColor);
    
    // Also update related color shades for consistency
    const lightenColor = (color: string, amount: number = 40) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      const newR = Math.min(255, r + amount);
      const newG = Math.min(255, g + amount);
      const newB = Math.min(255, b + amount);
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };
    
    const darkenColor = (color: string, amount: number = 40) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      const newR = Math.max(0, r - amount);
      const newG = Math.max(0, g - amount);
      const newB = Math.max(0, b - amount);
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };

    root.style.setProperty('--color-primary-light', lightenColor(config.theme.primaryColor, 40));
    root.style.setProperty('--color-primary-dark', darkenColor(config.theme.primaryColor, 40));

    console.log('✅ Config sync complete!');
    hasInitialized.current = true;
  }, [
    config.theme.mode,
    config.theme.primaryColor,
    config.theme.fontSize,
    setTheme,
    setFontSize,
    setMinimalMode,
    setDarkMode,
  ]);
}