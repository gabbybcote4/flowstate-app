import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

/**
 * Emotional State Manager
 * 
 * Tracks user's emotional state and triggers appropriate UI responses:
 * - Gentle mode when overwhelmed
 * - Celebrations for achievements
 * - Adaptive brightness and colors
 */

export type EmotionalState = 'calm' | 'energized' | 'overwhelmed' | 'tired' | 'anxious' | 'joyful';
export type CelebrationEvent = 'reflection-complete' | 'week-complete' | 'habit-streak' | 'milestone';

interface EmotionalStateContextType {
  currentState: EmotionalState;
  isGentleMode: boolean;
  brightness: number;
  setEmotionalState: (state: EmotionalState) => void;
  toggleGentleMode: () => void;
  triggerCelebration: (event: CelebrationEvent, metadata?: any) => void;
  updateBrightness: (level: number) => void;
}

const EmotionalStateContext = createContext<EmotionalStateContextType | undefined>(undefined);

export function useEmotionalState() {
  const context = useContext(EmotionalStateContext);
  if (!context) {
    throw new Error('useEmotionalState must be used within EmotionalStateProvider');
  }
  return context;
}

interface EmotionalStateProviderProps {
  children: ReactNode;
}

export function EmotionalStateProvider({ children }: EmotionalStateProviderProps) {
  const [currentState, setCurrentState] = useState<EmotionalState>('calm');
  const [isGentleMode, setIsGentleMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [celebrationQueue, setCelebrationQueue] = useState<Array<{ event: CelebrationEvent; metadata?: any }>>([]);

  // Load saved state from localStorage
  useEffect(() => {
    const savedGentleMode = localStorage.getItem('flowstate-gentle-mode');
    if (savedGentleMode === 'true') {
      setIsGentleMode(true);
    }

    const savedBrightness = localStorage.getItem('flowstate-brightness');
    if (savedBrightness) {
      setBrightness(parseInt(savedBrightness));
    }
  }, []);

  // Auto-detect emotional state from check-in data
  useEffect(() => {
    const checkInDate = localStorage.getItem('flowstate-coaching-date');
    const today = new Date().toDateString();
    
    if (checkInDate === today) {
      const checkInData = localStorage.getItem('flowstate-coaching-data');
      if (checkInData) {
        const data = JSON.parse(checkInData);
        detectEmotionalState(data.mood, data.energy, data.focus);
      }
    }
  }, []);

  const detectEmotionalState = (mood: number, energy: number, focus: number) => {
    // Low across all metrics = overwhelmed
    if (mood <= 2 && energy <= 2 && focus <= 2) {
      setEmotionalState('overwhelmed');
      return;
    }

    // Low energy but okay mood = tired
    if (energy <= 2 && mood >= 3) {
      setEmotionalState('tired');
      return;
    }

    // Low focus specifically = anxious
    if (focus <= 2 && mood <= 3) {
      setEmotionalState('anxious');
      return;
    }

    // High across all = joyful
    if (mood >= 4 && energy >= 4 && focus >= 4) {
      setEmotionalState('joyful');
      return;
    }

    // High energy = energized
    if (energy >= 4) {
      setEmotionalState('energized');
      return;
    }

    // Default
    setEmotionalState('calm');
  };

  const setEmotionalState = (state: EmotionalState) => {
    setCurrentState(state);

    // Auto-enable gentle mode if overwhelmed or anxious
    if (state === 'overwhelmed' || state === 'anxious') {
      if (!isGentleMode) {
        setIsGentleMode(true);
        localStorage.setItem('flowstate-gentle-mode', 'true');
        
        // Dim brightness slightly
        const newBrightness = Math.max(70, brightness - 20);
        setBrightness(newBrightness);
        localStorage.setItem('flowstate-brightness', newBrightness.toString());

        // Show gentle notification
        toast.info('💙 Gentle mode activated - take it easy today', {
          duration: 4000,
          description: 'Dimmed brightness and simplified view enabled',
        });
      }
    }
  };

  const toggleGentleMode = () => {
    const newMode = !isGentleMode;
    setIsGentleMode(newMode);
    localStorage.setItem('flowstate-gentle-mode', newMode.toString());

    if (newMode) {
      // Dim brightness
      const newBrightness = 75;
      setBrightness(newBrightness);
      localStorage.setItem('flowstate-brightness', newBrightness.toString());
      toast.success('Gentle mode enabled 🌙');
    } else {
      // Reset brightness
      const newBrightness = 100;
      setBrightness(newBrightness);
      localStorage.setItem('flowstate-brightness', newBrightness.toString());
      toast.success('Gentle mode disabled ☀️');
    }
  };

  const triggerCelebration = (event: CelebrationEvent, metadata?: any) => {
    setCelebrationQueue(prev => [...prev, { event, metadata }]);

    // Auto-clear after animation
    setTimeout(() => {
      setCelebrationQueue(prev => prev.slice(1));
    }, 4000);
  };

  const updateBrightness = (level: number) => {
    const clampedLevel = Math.max(50, Math.min(100, level));
    setBrightness(clampedLevel);
    localStorage.setItem('flowstate-brightness', clampedLevel.toString());
  };

  return (
    <EmotionalStateContext.Provider
      value={{
        currentState,
        isGentleMode,
        brightness,
        setEmotionalState,
        toggleGentleMode,
        triggerCelebration,
        updateBrightness,
      }}
    >
      {children}
    </EmotionalStateContext.Provider>
  );
}
