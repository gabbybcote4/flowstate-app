/**
 * useLocalStorage Hook
 * 
 * Reusable hook for localStorage state management with TypeScript support
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }
      
      try {
        // Try to parse as JSON
        return JSON.parse(item);
      } catch (parseError) {
        // If parsing fails, it's a plain string - migrate it automatically
        console.log(`Auto-migrating plain string for key "${key}" in useLocalStorage`);
        
        // Re-save as JSON-stringified value
        window.localStorage.setItem(key, JSON.stringify(item));
        
        // Return the plain string as the value
        return item as T;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Function to remove the value from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Simple localStorage getter with automatic plain-string migration
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }
    
    try {
      // Try to parse as JSON
      return JSON.parse(item);
    } catch (parseError) {
      // If parsing fails, it's a plain string - migrate it automatically
      console.log(`Auto-migrating plain string for key "${key}"`);
      
      // Re-save as JSON-stringified value
      window.localStorage.setItem(key, JSON.stringify(item));
      
      // Return the plain string as the value
      return item as T;
    }
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Simple localStorage setter
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Clear specific localStorage items by prefix
 */
export function clearLocalStorageByPrefix(prefix: string): void {
  if (typeof window === 'undefined') return;
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error(`Error clearing localStorage with prefix "${prefix}":`, error);
  }
}