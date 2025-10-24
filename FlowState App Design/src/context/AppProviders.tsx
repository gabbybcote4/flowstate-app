// src/context/AppProviders.tsx

import React, { memo } from 'react';
import { ThemeProvider } from '../components/ThemeContext';
import { NotificationProvider } from '../components/system/EnhancedNotificationSystem';
import { NavigationProvider } from '../components/context/NavigationContext';
import { UserConfigProvider } from '../config/UserConfigContext';
import { DataStoreProvider } from '../components/context/DataStoreContext'; 

interface AppProvidersProps { children: React.ReactNode; }

export const AppProviders = memo(({ children }: AppProvidersProps) => {
  return (
    <UserConfigProvider>
      <ThemeProvider>
        <DataStoreProvider> 
          <NavigationProvider persist initialScreen="home">
              <NotificationProvider>
                {children}
              </NotificationProvider>
          </NavigationProvider>
        </DataStoreProvider>
      </ThemeProvider>
    </UserConfigProvider>
  );
});

AppProviders.displayName = 'AppProviders';
