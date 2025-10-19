/**
 * useMoodCheck Hook
 * 
 * Manages daily mood check-in state
 */

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
    const today = new Date().toDateString();
    
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
    const today = new Date().toDateString();
    console.log('📝 setMood called:', { mood, today });
    setLocalStorageItem(MOOD_KEY, mood);
    setLocalStorageItem(MOOD_DATE_KEY, today);
    
    setMoodState({
      hasSetMood: true,
      mood,
      date: today,
    });
    console.log('✅ Mood state updated to hasSetMood: true');
  }, []);

  const resetMoodForNewDay = useCallback(() => {
    const today = new Date().toDateString();
    const savedDate = getLocalStorageItem(MOOD_DATE_KEY, null);
    
    if (savedDate !== today) {
      setMoodState({
        hasSetMood: false,
        mood: null,
        date: null,
      });
    }
  }, []);

  // Check on mount and when date changes
  useEffect(() => {
    resetMoodForNewDay();
    
    // Check every minute if we've crossed into a new day
    const interval = setInterval(resetMoodForNewDay, 60000);
    
    return () => clearInterval(interval);
  }, [resetMoodForNewDay]);

  return {
    ...moodState,
    setMood,
    resetMoodForNewDay,
  };
}