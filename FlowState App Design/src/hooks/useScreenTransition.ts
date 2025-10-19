/**
 * useScreenTransition Hook
 * 
 * Manages screen transition animations and loading states
 */

import { useState, useEffect, useRef } from 'react';

export interface TransitionConfig {
  duration?: number;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export function useScreenTransition(
  currentScreen: string,
  config: TransitionConfig = {}
) {
  const {
    duration = 400,
    onTransitionStart,
    onTransitionEnd,
  } = config;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousScreen, setPreviousScreen] = useState(currentScreen);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (previousScreen !== currentScreen) {
      setIsTransitioning(true);
      setPreviousScreen(currentScreen);
      onTransitionStart?.();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset transition state after animation completes
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        onTransitionEnd?.();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentScreen, previousScreen, duration, onTransitionStart, onTransitionEnd]);

  return {
    isTransitioning,
    previousScreen,
  };
}
