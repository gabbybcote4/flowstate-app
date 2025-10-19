/**
 * NavigationContext
 * 
 * Centralized navigation state management with screen history,
 * restore last screen functionality, and navigation stack
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ScreenName =
  | 'home'
  | 'checkin'
  | 'todos'
  | 'calendar'
  | 'coach'
  | 'reflection'
  | 'settings'
  | 'habit-builder'
  | 'habit-stacking'
  | 'habit-education'
  | 'discipline-builder'
  | 'growth-map'
  | 'goal-wizard'
  | 'timeflow'
  | 'focus-tools'
  | 'weekly-insights'
  | 'life-coaching'
  | 'integrations'
  | 'integrations-guide'
  | 'community'
  | 'symptom-tracker';

interface NavigationState {
  currentScreen: ScreenName;
  previousScreen: ScreenName | null;
  history: ScreenName[];
  params: Record<string, any>;
}

interface NavigationContextType {
  /** Current active screen */
  currentScreen: ScreenName;
  
  /** Previous screen in history */
  previousScreen: ScreenName | null;
  
  /** Full navigation history stack */
  history: ScreenName[];
  
  /** Current screen parameters */
  params: Record<string, any>;
  
  /** Navigate to a screen */
  navigate: (screen: ScreenName, params?: Record<string, any>) => void;
  
  /** Go back to previous screen */
  goBack: () => void;
  
  /** Replace current screen (no history entry) */
  replace: (screen: ScreenName, params?: Record<string, any>) => void;
  
  /** Reset navigation to home */
  reset: () => void;
  
  /** Check if can go back */
  canGoBack: boolean;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const STORAGE_KEY = 'flowstate-navigation-state';
const DEFAULT_SCREEN: ScreenName = 'home';

// ============================================================================
// NAVIGATION PROVIDER
// ============================================================================

interface NavigationProviderProps {
  children: ReactNode;
  /** Initial screen (defaults to last saved or home) */
  initialScreen?: ScreenName;
  /** Enable persistence to localStorage */
  persist?: boolean;
}

export function NavigationProvider({
  children,
  initialScreen,
  persist = true,
}: NavigationProviderProps) {
  // Initialize from localStorage or defaults
  const [state, setState] = useState<NavigationState>(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as NavigationState;
          return parsed;
        }
      } catch (error) {
        console.error('Failed to restore navigation state:', error);
      }
    }

    return {
      currentScreen: initialScreen || DEFAULT_SCREEN,
      previousScreen: null,
      history: [initialScreen || DEFAULT_SCREEN],
      params: {},
    };
  });

  // Persist state to localStorage
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to persist navigation state:', error);
      }
    }
  }, [state, persist]);

  // Navigate to a new screen
  const navigate = (screen: ScreenName, params: Record<string, any> = {}) => {
    setState((prev) => ({
      currentScreen: screen,
      previousScreen: prev.currentScreen,
      history: [...prev.history, screen],
      params,
    }));
  };

  // Go back to previous screen
  const goBack = () => {
    setState((prev) => {
      if (prev.history.length <= 1) {
        // Can't go back, stay on current screen
        return prev;
      }

      const newHistory = [...prev.history];
      newHistory.pop(); // Remove current
      const previousScreen = newHistory[newHistory.length - 1];

      return {
        currentScreen: previousScreen,
        previousScreen: newHistory.length > 1 ? newHistory[newHistory.length - 2] : null,
        history: newHistory,
        params: {},
      };
    });
  };

  // Replace current screen (no history entry)
  const replace = (screen: ScreenName, params: Record<string, any> = {}) => {
    setState((prev) => {
      const newHistory = [...prev.history];
      newHistory[newHistory.length - 1] = screen; // Replace last entry

      return {
        currentScreen: screen,
        previousScreen: prev.previousScreen,
        history: newHistory,
        params,
      };
    });
  };

  // Reset to home screen
  const reset = () => {
    setState({
      currentScreen: DEFAULT_SCREEN,
      previousScreen: null,
      history: [DEFAULT_SCREEN],
      params: {},
    });
  };

  const canGoBack = state.history.length > 1;

  const value: NavigationContextType = {
    currentScreen: state.currentScreen,
    previousScreen: state.previousScreen,
    history: state.history,
    params: state.params,
    navigate,
    goBack,
    replace,
    reset,
    canGoBack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Use navigation context
 */
export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

/**
 * Use screen-specific navigation
 * Returns true if the specified screen is currently active
 */
export function useIsScreen(screen: ScreenName): boolean {
  const { currentScreen } = useNavigation();
  return currentScreen === screen;
}

/**
 * Use navigation params
 */
export function useNavigationParams<T = Record<string, any>>(): T {
  const { params } = useNavigation();
  return params as T;
}

/**
 * Restore last screen on app mount
 */
export function useRestoreLastScreen() {
  const { currentScreen } = useNavigation();

  useEffect(() => {
    console.log(`[Navigation] Restored to screen: ${currentScreen}`);
  }, []);

  return currentScreen;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear navigation history from localStorage
 */
export function clearNavigationHistory() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Get navigation state from localStorage
 */
export function getStoredNavigationState(): NavigationState | null {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to get stored navigation state:', error);
    }
  }
  return null;
}

/**
 * Navigation history analytics
 */
export function useNavigationAnalytics() {
  const { history, currentScreen } = useNavigation();

  return {
    /** Total screens visited */
    totalScreens: history.length,
    
    /** Current screen */
    current: currentScreen,
    
    /** Most visited screen */
    mostVisited: getMostVisited(history),
    
    /** Navigation path */
    path: history.join(' → '),
  };
}

function getMostVisited(history: ScreenName[]): ScreenName | null {
  if (history.length === 0) return null;

  const counts = history.reduce((acc, screen) => {
    acc[screen] = (acc[screen] || 0) + 1;
    return acc;
  }, {} as Record<ScreenName, number>);

  return Object.entries(counts).reduce((a, b) => 
    counts[a[0] as ScreenName] > counts[b[0] as ScreenName] ? a : b
  )[0] as ScreenName;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Back button component
 */
interface BackButtonProps {
  fallback?: ScreenName;
  children?: ReactNode;
  className?: string;
}

export function BackButton({ fallback = 'home', children, className = '' }: BackButtonProps) {
  const { goBack, canGoBack, navigate } = useNavigation();

  const handleBack = () => {
    if (canGoBack) {
      goBack();
    } else if (fallback) {
      navigate(fallback);
    }
  };

  return (
    <button onClick={handleBack} className={className}>
      {children || '← Back'}
    </button>
  );
}

/**
 * Navigation guard - redirect if condition not met
 */
interface NavigationGuardProps {
  condition: boolean;
  redirectTo: ScreenName;
  children: ReactNode;
}

export function NavigationGuard({ 
  condition, 
  redirectTo, 
  children 
}: NavigationGuardProps) {
  const { navigate, currentScreen } = useNavigation();

  useEffect(() => {
    if (!condition && currentScreen !== redirectTo) {
      navigate(redirectTo);
    }
  }, [condition, redirectTo, currentScreen, navigate]);

  if (!condition) return null;

  return <>{children}</>;
}

/**
 * Screen component wrapper with auto-tracking
 */
interface ScreenProps {
  name: ScreenName;
  children: ReactNode;
}

export function Screen({ name, children }: ScreenProps) {
  const { currentScreen } = useNavigation();

  if (currentScreen !== name) return null;

  return <>{children}</>;
}
