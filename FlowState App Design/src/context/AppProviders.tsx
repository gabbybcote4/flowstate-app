/**
 * AppProviders
 * 
 * Centralized context providers wrapper with optimized nesting
 */

import React, { memo } from 'react';
import { ThemeProvider } from '../components/context/ThemeContext';
import { EmotionalStateProvider } from '../components/manager/EmotionalStateManager';
import { NotificationProvider } from '../components/system/EnhancedNotificationSystem';
import { NavigationProvider } from '../components/context/NavigationContext';
import { UserConfigProvider } from '../config/UserConfigContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * All app-level context providers in optimized order
 * Order matters for performance and dependency resolution
 */
export const AppProviders = memo(({ children }: AppProvidersProps) => {
  return (
    <UserConfigProvider>
      <ThemeProvider>
        <NavigationProvider persist initialScreen="home">
          <EmotionalStateProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </EmotionalStateProvider>
        </NavigationProvider>
      </ThemeProvider>
    </UserConfigProvider>
  );
});

AppProviders.displayName = 'AppProviders';