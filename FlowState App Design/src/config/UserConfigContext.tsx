// UserConfigContext.tsx

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserConfig, DEFAULT_USER_CONFIG } from './userConfig.types';

interface UserConfigContextType {
  config: UserConfig;
  updateConfig: (updates: Partial<UserConfig>) => void;
  resetConfig: () => void;
}

const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined);

type ConfigAction =
  | { type: 'UPDATE_CONFIG'; payload: Partial<UserConfig> }
  | { type: 'RESET_CONFIG' }
  | { type: 'LOAD_CONFIG'; payload: UserConfig };

function configReducer(state: UserConfig, action: ConfigAction): UserConfig {
  switch (action.type) {
    case 'UPDATE_CONFIG':
      return { ...state, ...action.payload };
    case 'RESET_CONFIG':
      return DEFAULT_USER_CONFIG;
    case 'LOAD_CONFIG':
      return action.payload;
    default:
      return state;
  }
}

// load config from localStorage
function loadConfig(): UserConfig {
  try {
    const stored = localStorage.getItem('flowstate-user-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_USER_CONFIG, ...parsed };
    }
  } catch (error) {
    console.error('Error loading user config:', error);
  }
  return DEFAULT_USER_CONFIG;
}

// save config to localStorage
function saveConfig(config: UserConfig) {
  try {
    localStorage.setItem('flowstate-user-config', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving user config:', error);
  }
}

export function UserConfigProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(configReducer, DEFAULT_USER_CONFIG, loadConfig);

  // save to localStorage whenever config changes
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const updateConfig = (updates: Partial<UserConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: updates });
  };

  const resetConfig = () => {
    dispatch({ type: 'RESET_CONFIG' });
  };

  return (
    <UserConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </UserConfigContext.Provider>
  );
}

export function useUserConfig() {
  const context = useContext(UserConfigContext);
  if (context === undefined) {
    throw new Error('useUserConfig must be used within a UserConfigProvider');
  }
  return context;
}
