import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from '../lib/motion-shim';

interface AISuggestion {
  id: string;
  text: string;
  reason: string;
  icon: string;
}

interface HealthData {
  sleep: string;
  steps: string;
  heartRate: string;
  upcomingEvents: number;
}

interface AISuggestionsWidgetProps {
  position?: 'top-right' | 'bottom-left';
  onAddHabit?: (habitName: string, habitPurpose: string) => void;
}

export function AISuggestionsWidget({ position = 'top-right', onAddHabit }: AISuggestionsWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Check if widget was minimized
  useEffect(() => {
    try {
      const minimizedState = localStorage.getItem('flowstate-ai-minimized');
      if (minimizedState === 'true') {
        setIsMinimized(true);
      }
    } catch (error) {
      console.error('Error loading minimized state:', error);
    }
  }, []);

  // Generate AI suggestion based on health data
  const generateSuggestion = (): AISuggestion => {
    // Mock health data - in a real app, this would come from props or context
    const healthData: HealthData = {
      sleep: '7h 20m',
      steps: '3,421',
      heartRate: '68 bpm',
      upcomingEvents: 3,
    };

    const sleepHours = parseFloat(healthData.sleep);
    const steps = parseInt(healthData.steps.replace(',', ''));
    const events = healthData.upcomingEvents;

    // AI logic to generate contextual suggestions
    const suggestions: AISuggestion[] = [];

    // Sleep-based suggestions
    if (sleepHours < 7) {
      suggestions.push({
        id: 'low-sleep',
        text: 'Try a 10-minute power nap',
        reason: 'You got less than 7 hours of sleep',
        icon: '😴',
      });
    } else if (sleepHours >= 7 && sleepHours < 8) {
      suggestions.push({
        id: 'good-sleep',
        text: 'Start with a light stretch',
        reason: 'Your sleep was decent, perfect for gentle movement',
        icon: '🌱',
      });
    } else {
      suggestions.push({
        id: 'great-sleep',
        text: 'Consider a morning walk',
        reason: 'You slept well! Energy is good for light activity',
        icon: '🚶',
      });
    }

    // Steps-based suggestions
    if (steps < 2000) {
      suggestions.push({
        id: 'low-steps',
        text: 'Take a 5-minute walk break',
        reason: 'Low step count today',
        icon: '👟',
      });
    } else if (steps >= 2000 && steps < 5000) {
      suggestions.push({
        id: 'moderate-steps',
        text: 'Hydrate with 500ml of water',
        reason: "You're moving well, stay hydrated",
        icon: '💧',
      });
    }

    // Calendar-based suggestions
    if (events > 4) {
      suggestions.push({
        id: 'busy-day',
        text: 'Schedule a 15-min breathing break',
        reason: 'Busy day ahead with many events',
        icon: '🫁',
      });
    } else if (events <= 2) {
      suggestions.push({
        id: 'light-day',
        text: 'Perfect day for a creative project',
        reason: 'Light schedule today',
        icon: '🎨',
      });
    }

    // Time-based suggestions
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 9) {
      suggestions.push({
        id: 'morning-routine',
        text: 'Start with gentle morning meditation',
        reason: "Morning is ideal for mindfulness",
        icon: '🧘',
      });
    } else if (currentHour >= 14 && currentHour < 17) {
      suggestions.push({
        id: 'afternoon-dip',
        text: 'Combat afternoon slump with a stretch',
        reason: 'Energy naturally dips in afternoon',
        icon: '🌿',
      });
    } else if (currentHour >= 18 && currentHour < 22) {
      suggestions.push({
        id: 'evening-wind',
        text: 'Wind down with evening journaling',
        reason: 'Evening is perfect for reflection',
        icon: '📔',
      });
    }

    // Return a random suggestion from the generated list
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const [suggestion, setSuggestion] = useState(generateSuggestion());

  const handleMinimize = () => {
    try {
      localStorage.setItem('flowstate-ai-minimized', 'true');
      setIsMinimized(true);
    } catch (error) {
      console.error('Error saving minimized state:', error);
    }
  };

  const handleExpand = () => {
    try {
      localStorage.setItem('flowstate-ai-minimized', 'false');
      setIsMinimized(false);
      // Generate a fresh suggestion when expanding
      setSuggestion(generateSuggestion());
      setIsAdded(false);
    } catch (error) {
      console.error('Error saving minimized state:', error);
    }
  };

  const handleAddToDay = () => {
    // Call the callback if provided
    if (onAddHabit) {
      onAddHabit(suggestion.text, suggestion.reason);
    }
    setIsAdded(true);
    setTimeout(() => {
      handleMinimize();
    }, 1500);
  };

  const positionClasses = position === 'bottom-left' 
    ? 'fixed bottom-24 left-4 z-50'
    : 'fixed top-6 right-4 z-50';

  return (
    <div className={positionClasses}>
      {/* Floating AI Button (Minimized State) */}
      {isMinimized ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExpand}
          className="w-14 h-14 bg-gradient-to-br from-lavender-400 to-purple-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center relative"
          aria-label="Open AI suggestions"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Sparkles size={24} className="text-white" />
          </motion.div>
          
          {/* Notification dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full border-2 border-white"
          />
        </motion.button>
      ) : (
        // Expanded Dropdown Panel
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 max-w-[calc(100vw-2rem)]"
          >
            <div className="bg-gradient-to-br from-lavender-100 to-purple-100 rounded-3xl shadow-2xl border-2 border-lavender-200 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-lavender-200 rounded-full opacity-20 blur-2xl -mr-16 -mt-16"></div>
              
              <div className="p-5">
                {/* Header with minimize button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.5,
                        repeat: isAdded ? 0 : Infinity,
                        repeatType: 'reverse',
                        repeatDelay: 3
                      }}
                      className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center"
                    >
                      {isAdded ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        >
                          <Check size={20} className="text-green-500" />
                        </motion.div>
                      ) : (
                        <Sparkles size={20} className="text-lavender-500" />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="text-lavender-700">AI Suggestion</h3>
                      <span className="text-xs bg-lavender-200 text-lavender-700 px-2 py-0.5 rounded-full">
                        Daily
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleMinimize}
                    className="p-2 rounded-full hover:bg-white/50 transition-colors"
                    aria-label="Minimize suggestion"
                  >
                    <X size={18} className="opacity-60" />
                  </button>
                </div>

                {/* Suggestion Content */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <p className="text-lavender-900">{suggestion.text}</p>
                  </div>
                  <p className="text-sm opacity-70 pl-9">{suggestion.reason}</p>
                </div>

                {/* Action buttons */}
                {!isAdded && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleAddToDay}
                      className="w-full px-4 py-2.5 rounded-2xl bg-lavender-400 text-white hover:bg-lavender-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      <span>Add to my day</span>
                    </button>
                    <button
                      onClick={handleMinimize}
                      className="w-full px-4 py-2 rounded-2xl bg-white/80 text-lavender-700 hover:bg-white transition-colors text-sm"
                    >
                      Maybe later
                    </button>
                  </div>
                )}

                {isAdded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-2 text-green-600"
                  >
                    ✓ Added to your routine!
                  </motion.div>
                )}
              </div>

              {/* Subtle animation line at bottom */}
              <motion.div
                className="h-1 bg-gradient-to-r from-lavender-400 via-purple-400 to-lavender-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
