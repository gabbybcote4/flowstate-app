import { useEffect, useState } from 'react';
//  from '../lib/motion-shim';
import { useEmotionalState } from './EmotionalStateManager';
import { useTheme } from './ThemeContext';
import { 
  Coffee, 
  Moon, 
  Sparkles, 
  Heart, 
  Wind, 
  Timer, 
  Target, 
 // CheckCircle,
  MessageCircle,
 // Lightbulb,
  X
} from 'lucide-react';

/**
 * Mindful Notification System
 * 
 * Smart, gentle notifications that act like a kind coach:
 * - Context-aware based on time, energy, and emotional state
 * - Conversational, supportive tone
 * - Non-intrusive with option to dismiss
 * - Actionable micro-suggestions
 */

interface MindfulNotification {
  id: string;
  type: 'breath' | 'focus' | 'energy' | 'hydrate' | 'rest' | 'celebration' | 'transition' | 'encouragement';
  message: string;
  subtext?: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    handler: () => void;
  };
  duration?: number;
}

export function useMindfulNotifications() {
  const { currentState, isGentleMode } = useEmotionalState();
  const [notifications, setNotifications] = useState<MindfulNotification[]>([]);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Minimum time between notifications (in milliseconds)
  const MIN_NOTIFICATION_INTERVAL = isGentleMode ? 900000 : 600000; // 15 min in gentle mode, 10 min otherwise

  const canShowNotification = () => {
    const now = Date.now();
    return now - lastNotificationTime > MIN_NOTIFICATION_INTERVAL;
  };

  const showNotification = (notification: MindfulNotification) => {
    if (!canShowNotification() || dismissedIds.has(notification.id)) {
      return;
    }

    setNotifications(prev => [...prev, notification]);
    setLastNotificationTime(Date.now());

    // Auto-dismiss after duration
    const duration = notification.duration || 8000;
    setTimeout(() => {
      dismissNotification(notification.id);
    }, duration);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setDismissedIds(prev => new Set([...prev, id]));
  };

  // Time-based notifications
  useEffect(() => {
    const checkTimeBasedNotifications = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Morning transition (8:00 AM)
      if (hour === 8 && minute === 0) {
        showNotification({
          id: `morning-${now.toDateString()}`,
          type: 'transition',
          message: 'Good morning ☀️',
          subtext: 'How are you feeling today? Check in when you\'re ready.',
          icon: <Coffee size={20} />,
          duration: 10000,
        });
      }

      // Mid-morning energy check (10:30 AM)
      if (hour === 10 && minute === 30) {
        showNotification({
          id: `midmorning-${now.toDateString()}`,
          type: 'energy',
          message: 'How\'s your energy?',
          subtext: 'Try a micro-win to keep momentum going.',
          icon: <Sparkles size={20} />,
        });
      }

      // Lunch reminder (12:30 PM)
      if (hour === 12 && minute === 30) {
        showNotification({
          id: `lunch-${now.toDateString()}`,
          type: 'rest',
          message: 'Time for a break?',
          subtext: 'Nourish your body and rest your mind.',
          icon: <Heart size={20} />,
        });
      }

      // Afternoon slump support (2:30 PM)
      if (hour === 14 && minute === 30) {
        showNotification({
          id: `afternoon-${now.toDateString()}`,
          type: 'breath',
          message: 'Pause for a breath?',
          subtext: 'A 2-minute reset can change your whole afternoon.',
          icon: <Wind size={20} />,
        });
      }

      // Evening wind-down (6:00 PM)
      if (hour === 18 && minute === 0) {
        showNotification({
          id: `evening-${now.toDateString()}`,
          type: 'transition',
          message: 'Work day winding down',
          subtext: 'You did what you could. That\'s enough.',
          icon: <Moon size={20} />,
        });
      }

      // Reflection reminder (8:00 PM)
      if (hour === 20 && minute === 0) {
        const hasReflected = localStorage.getItem('flowstate-reflections');
        const today = new Date().toISOString().split('T')[0];
        const reflections = hasReflected ? JSON.parse(hasReflected) : {};
        
        if (!reflections[today]) {
          showNotification({
            id: `reflection-${now.toDateString()}`,
            type: 'encouragement',
            message: 'Ready to reflect?',
            subtext: 'Just a few moments to notice your day.',
            icon: <MessageCircle size={20} />,
          });
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeBasedNotifications, 60000);
    checkTimeBasedNotifications(); // Run immediately

    return () => clearInterval(interval);
  }, [currentState, isGentleMode]);

  // Focus session notifications
  useEffect(() => {
    const checkFocusSessions = () => {
      const sessions = JSON.parse(localStorage.getItem('flowstate-focus-sessions') || '[]');
      const now = new Date();
      
      sessions.forEach((session: any) => {
        if (!session.startTime) return;
        
        const sessionStart = new Date(session.startTime);
        const timeDiff = sessionStart.getTime() - now.getTime();
        
        // Notify 5 minutes before focus session
        if (timeDiff > 0 && timeDiff <= 300000 && timeDiff >= 240000) {
          showNotification({
            id: `focus-upcoming-${session.id}`,
            type: 'focus',
            message: 'Your focus window starts soon',
            subtext: `"${session.task}" in ${Math.ceil(timeDiff / 60000)} minutes`,
            icon: <Timer size={20} />,
          });
        }
      });
    };

    const interval = setInterval(checkFocusSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  // Emotional state-based notifications
  useEffect(() => {
    if (!canShowNotification()) return;

    const showStateBasedNotification = () => {
      switch (currentState) {
        case 'overwhelmed':
          showNotification({
            id: `overwhelmed-${Date.now()}`,
            type: 'breath',
            message: 'Feeling a lot right now?',
            subtext: 'One thing at a time. Start with a breath.',
            icon: <Wind size={20} />,
          });
          break;
        
        case 'anxious':
          showNotification({
            id: `anxious-${Date.now()}`,
            type: 'breath',
            message: 'Notice that racing mind?',
            subtext: 'Ground yourself with 3 deep breaths.',
            icon: <Wind size={20} />,
          });
          break;
        
        case 'tired':
          showNotification({
            id: `tired-${Date.now()}`,
            type: 'rest',
            message: 'Your energy is low',
            subtext: 'Rest isn\'t lazy. It\'s necessary.',
            icon: <Moon size={20} />,
          });
          break;
      }
    };

    // Show state-based notification after 2 minutes in that state
    const timeout = setTimeout(showStateBasedNotification, 120000);
    return () => clearTimeout(timeout);
  }, [currentState]);

  // Habit streak encouragement
  useEffect(() => {
    const checkHabitStreaks = () => {
      const habits = JSON.parse(localStorage.getItem('flowstate-habits') || '[]');
      
      habits.forEach((habit: any) => {
        if (habit.streak >= 3 && !habit.completedToday) {
          showNotification({
            id: `habit-streak-${habit.id}`,
            type: 'encouragement',
            message: `Keep your ${habit.streak}-day streak going?`,
            subtext: `"${habit.name}" - you're doing great`,
            icon: <Target size={20} />,
          });
        }
      });
    };

    // Check once per hour
    const interval = setInterval(checkHabitStreaks, 3600000);
    checkHabitStreaks();

    return () => clearInterval(interval);
  }, []);

  return { notifications, dismissNotification, showNotification };
}

// Notification Display Component
export function MindfulNotificationDisplay() {
  const { notifications, dismissNotification } = useMindfulNotifications();
  const { themeColors } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm pointer-events-none">
        {notifications.map((notification) => (
          <MindfulNotificationCard
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissNotification(notification.id)}
            themeColors={themeColors}
          />
        ))}
    </div>
  );
}

interface NotificationCardProps {
  notification: MindfulNotification;
  onDismiss: () => void;
  themeColors: any;
}

function MindfulNotificationCard({ notification, onDismiss, themeColors }: NotificationCardProps) {
  const getBackgroundStyle = (type: string) => {
    switch (type) {
      case 'breath':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200';
      case 'focus':
        return 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200';
      case 'energy':
        return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200';
      case 'hydrate':
        return 'bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200';
      case 'rest':
        return 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200';
      case 'celebration':
        return 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200';
      case 'transition':
        return 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200';
      case 'encouragement':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    < div

      className={`${getBackgroundStyle(notification.type)} rounded-2xl shadow-lg border-2 overflow-hidden pointer-events-auto`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          < div

            className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center"
            style={{ color: themeColors.primary }}
          >
            {notification.icon}
          </ div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p

              className="text-sm text-gray-800 mb-1"
            >
              {notification.message}
            </p>
            {notification.subtext && (
              <p

                className="text-xs text-gray-600 leading-relaxed"
              >
                {notification.subtext}
              </p>
            )}

            {/* Action button */}
            {notification.action && (
              < button

                onClick={notification.action.handler}
                className="mt-3 px-4 py-1.5 rounded-lg text-xs transition-colors"
                style={{
                  backgroundColor: `${themeColors.primary}20`,
                  color: themeColors.primary,
                }}
              >
                {notification.action.label}
              </ button>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-colors"
          >
            <X size={12} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      < div

        className="h-1 bg-white/40"
        style={{ transformOrigin: 'left' }}
      />
    </ div>
  );
}

// Smart suggestion generator
export function generateMindfulSuggestion(context: {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  energyLevel: 'low' | 'moderate' | 'high';
  emotionalState: string;
}): string {
  const { timeOfDay, energyLevel,  } = context;

  const suggestions = {
    morning: {
      low: [
        'Start with your easiest task. Momentum builds energy.',
        'One small thing. That\'s all you need right now.',
        'Your morning pace is perfect. Trust it.',
      ],
      moderate: [
        'Tackle one priority task before anything else.',
        'Your focus is fresh. Use this time wisely.',
        'Morning energy is on your side.',
      ],
      high: [
        'Great energy! Channel it into your most important work.',
        'This is your power window. Make it count.',
        'Ride this wave—you\'ve got momentum.',
      ],
    },
    afternoon: {
      low: [
        'Afternoon slump is real. A short walk helps.',
        'Lower your expectations. Just finish one thing.',
        'Rest for 10 minutes. Then reassess.',
      ],
      moderate: [
        'Keep the momentum with bite-sized tasks.',
        'You\'re halfway through. Steady wins.',
        'One more small win before you pause.',
      ],
      high: [
        'Still going strong! Protect this energy.',
        'Use this boost for creative work.',
        'You\'re in flow. Keep riding it.',
      ],
    },
    evening: {
      low: [
        'You did enough today. Time to rest.',
        'Low energy in evening is normal. Be gentle.',
        'Tomorrow is a new start. Rest now.',
      ],
      moderate: [
        'Finish strong with one tiny task, or rest. Both are good.',
        'Reflect on what worked today.',
        'Wind down at your own pace.',
      ],
      high: [
        'Evening energy! Use it for light tasks or hobbies.',
        'Great time for planning tomorrow.',
        'Ride this energy, but don\'t forget to rest.',
      ],
    },
  };

  const timeSuggestions = suggestions[timeOfDay][energyLevel as 'low' | 'moderate' | 'high'];
  return timeSuggestions[Math.floor(Math.random() * timeSuggestions.length)];
}
