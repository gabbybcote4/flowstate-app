// src/hooks/useConfigSync.ts

import { useEffect, useRef } from 'react';
import { useUserConfig } from '../config/UserConfigContext';
import { useTheme } from '../components/ThemeContext';

export function useConfigSync() {
  const { config } = useUserConfig();
  const { setTheme, setFontSize, setDarkMode } = useTheme();
  const hasInitialized = useRef(false);

  // sync theme settings from config to ThemeContext
  useEffect(() => {
    // skip if already initialized
    if (hasInitialized.current) {
      return;
    }

    // check if user manually changed settings in ThemeContext
    const manualDarkMode = localStorage.getItem('flowstate-darkmode');
    const manualFontSize = localStorage.getItem('flowstate-fontsize');
    const manualTheme = localStorage.getItem('flowstate-theme');

    // apply dark mode
    if (manualDarkMode !== null) {
      // user  manually set dark mode in settings
      setDarkMode(manualDarkMode === 'true');
 
    } else {
      // no manual override, apply from config
      switch (config.theme.mode) {
        case 'light':
          setDarkMode(false);
          break;
        case 'dark':
          setDarkMode(true);
          break;
        case 'minimal':
          setDarkMode(false);
          break;
        case 'auto':
          // detect system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setDarkMode(prefersDark);
          break;
      }
    }

    // apply primary color
    if (manualTheme !== null) {
      // user  manually selected theme in Settings
      setTheme(manualTheme as 'Lavender' | 'Mint' | 'Peach');
    } else {
      // apply primary color to ThemeContext
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

    // apply font size
    if (manualFontSize !== null) {
      // user has manually changed font size in settings
      setFontSize(manualFontSize as 'Small' | 'Medium' | 'Large');
    } else {
      const fontSizeMap = {
        small: 'Small' as const,
        medium: 'Medium' as const,
        large: 'Large' as const,
      };
      setFontSize(fontSizeMap[config.theme.fontSize]);
    }

    // apply custom primary color to css variables directly
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.theme.primaryColor);
    root.style.setProperty('--color-ring', config.theme.primaryColor);
    
    // update related color shades for consistency
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

    hasInitialized.current = true;
  }, [
    config.theme.mode,
    config.theme.primaryColor,
    config.theme.fontSize,
    setTheme,
    setFontSize,
    setDarkMode,
  ]);
}