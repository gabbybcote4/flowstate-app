// useMoodCheck.ts

import { useState, useEffect, useCallback } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from './useLocalStorage';

const MOOD_KEY = 'flowstate-mood';
const MOOD_DATE_KEY = 'flowstate-mood-date';

export interface MoodCheckState {
  hasSetMood: boolean;
  mood: string | null;
  date: string | null;
}

export function useMoodCheck() {
  const [moodState, setMoodState] = useState<MoodCheckState>(() => {
    const savedDate = getLocalStorageItem(MOOD_DATE_KEY, null);
    const savedMood = getLocalStorageItem(MOOD_KEY, null);
    const today = new Date().toISOString().split('T')[0]; 
    
    if (savedDate === today && savedMood) {
      return {
        hasSetMood: true,
        mood: savedMood,
        date: savedDate,
      };
    }
    
    return {
      hasSetMood: false,
      mood: null,
      date: null,
    };
  });

  const setMood = useCallback((mood: string) => {
  const today = new Date().toISOString().split('T')[0]; 
    setLocalStorageItem(MOOD_KEY, mood);
    setLocalStorageItem(MOOD_DATE_KEY, today);
    
    setMoodState({
      hasSetMood: true,
      mood,
      date: today,
    });
  }, []);

  const resetMoodForNewDay = useCallback(() => {
  const today = new Date().toISOString().split('T')[0]; 
    const savedDate = getLocalStorageItem(MOOD_DATE_KEY, null);
    
    if (savedDate !== today) {
      setMoodState({
        hasSetMood: false,
        mood: null,
        date: null,
      });
    }
  }, []);

  // check on mount and when date changes
  useEffect(() => {
    resetMoodForNewDay();
    
    // check every minute if we've crossed into a new day
    const interval = setInterval(resetMoodForNewDay, 60000);
    
    return () => clearInterval(interval);
  }, [resetMoodForNewDay]);

  return {
    ...moodState,
    setMood,
    resetMoodForNewDay,
  };
}