import { useState, useEffect, useRef, createContext, useContext } from 'react';
//  from '../lib/motion-shim';
//import { useEmotionalState } from './EmotionalStateManager';
import { useTheme } from './ThemeContext';
import {
  Sparkles,
  Wind,
  Calendar,
  Brain,
  Bell,
  Plus,
 // Clock,
  MessageCircleHeart,
  Target,
  X,
  //Check,
 // TrendingUp,
 // Coffee,
//  Moon,
} from 'lucide-react';

/**
 * Enhanced Notification System
 * 
 * Four notification types:
 * 1. Micro-win time - Celebrate small achievements
 * 2. Breathe - Mindful breathing prompts
 * 3. Gentle plan available - AI-generated adaptive plans
 * 4. Focus window - Optimal productivity periods
 * 
 * Actions:
 * - Add to Plan
 * - Snooze 20m
 * - Open Coach
 * 
 * Design: Rounded, translucent toast cards with slow fade
 */

export type NotificationType = 'micro-win' | 'breathe' | 'gentle-plan' | 'focus-window';

export interface EnhancedNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  actions?: NotificationAction[];
  metadata?: any;
  duration?: number; // milliseconds
}

export interface NotificationAction {
  id: string;
  label: string;
  icon?: any;
  variant?: 'primary' | 'secondary' | 'ghost';
  handler: () => void;
}

interface NotificationContextType {
  notifications: EnhancedNotification[];
  showNotification: (notification: Omit<EnhancedNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  snoozeNotification: (id: string, duration?: number) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Notification Provider
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
 // const [snoozedNotifications, setSnoozedNotifications] = useState<Map<string, number>>(new Map());
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showNotification = (notification: Omit<EnhancedNotification, 'id' | 'timestamp'>) => {
    const id = `${notification.type}-${Date.now()}`;
    const newNotification: EnhancedNotification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration || 12000, // 12 seconds default
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss after duration
    const timeout = setTimeout(() => {
      dismissNotification(id);
    }, newNotification.duration);

    timeoutRefs.current.set(id, timeout);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
  };

  const snoozeNotification = (id: string, duration = 1200000) => { // 20 minutes default
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    dismissNotification(id);
   // setSnoozedNotifications(prev => new Map(prev).set(notification.type, Date.now() + duration));

    // Re-show after snooze duration
    setTimeout(() => {
      showNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        actions: notification.actions,
        metadata: notification.metadata,
      });
      // setSnoozedNotifications(prev => {
      //   const newMap = new Map(prev);
      //   newMap.delete(notification.type);
      //   return newMap;
      // });
    }, duration);
  };

  const clearAll = () => {
    notifications.forEach(n => dismissNotification(n.id));
  };

  useEffect(() => {
    return () => {
      // Cleanup all timeouts
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        dismissNotification,
        snoozeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Smart Notification Generator Hook
export function useSmartNotifications(onNavigate?: (screen: string) => void) {
  const { showNotification } = useNotifications();
  //const { currentState, isGentleMode } = useEmotionalState();
  const lastCheckRef = useRef<Map<string, number>>(new Map());

  // Micro-win detection
  useEffect(() => {
    const checkMicroWins = () => {
      const habits = JSON.parse(localStorage.getItem('flowstate-habits') || '[]');
      const todos = JSON.parse(localStorage.getItem('flowstate-todos') || '[]');
      const today = new Date().toDateString();
      
      // Check if user just completed a habit
      const recentHabitCompletion = habits.some((habit: any) => {
        const completedToday = (habit.completedSlots || []).some(
          (slot: any) => new Date(slot.date).toDateString() === today
        );
        return completedToday;
      });

      // Check if user just completed a todo
      const recentTodoCompletion = todos.some((todo: any) => {
        if (!todo.completedAt) return false;
        const completedDate = new Date(todo.completedAt);
        const timeSince = Date.now() - completedDate.getTime();
        return timeSince < 300000; // Within last 5 minutes
      });

      const lastMicroWin = lastCheckRef.current.get('micro-win') || 0;
      const timeSinceLastMicroWin = Date.now() - lastMicroWin;

      if ((recentHabitCompletion || recentTodoCompletion) && timeSinceLastMicroWin > 600000) { // 10 min cooldown
        showNotification({
          type: 'micro-win',
          title: '✨ Micro-win time!',
          message: 'You just completed something. That momentum? Keep it going with one more tiny win.',
          actions: [
            {
              id: 'add-to-plan',
              label: 'Add to Plan',
              icon: Plus,
              variant: 'primary',
              handler: () => {
                onNavigate?.('timeflow');
              },
            },
            {
              id: 'view-habits',
              label: 'View Habits',
              icon: Target,
              variant: 'secondary',
              handler: () => {
                onNavigate?.('habits');
              },
            },
          ],
          duration: 15000,
        });
        
        lastCheckRef.current.set('micro-win', Date.now());
      }
    };

    const interval = setInterval(checkMicroWins, 60000); // Check every minute
    checkMicroWins();
    
    return () => clearInterval(interval);
  }, [showNotification, onNavigate]);

  // Breathing prompts
  useEffect(() => {
    const checkBreathingPrompts = () => {
      //const hour = new Date().getHours();
      //const lastBreath = lastCheckRef.current.get('breathe') || 0;
     // const timeSinceLastBreath = Date.now() - lastBreath;
      
      // Afternoon breathing prompt (2-4 PM)
     // const isAfternoonSlump = hour >= 14 && hour <= 16;
      
      // Anxious/overwhelmed state
     // const needsCalming = currentState === 'anxious' || currentState === 'overwhelmed';
      
      // if ((isAfternoonSlump || needsCalming) && timeSinceLastBreath > 1800000) { // 30 min cooldown
      //   const messages = [
      //     'Your mind needs a reset. Three deep breaths can shift everything.',
      //     'Notice your breathing right now. Is it shallow? Let\'s fix that together.',
      //     'Pause. Breathe in for 4, hold for 4, out for 6. You\'ve got this.',
      //   ];
        
      //   showNotification({
      //     type: 'breathe',
      //     title: '🫁 Time to breathe',
      //     message: messages[Math.floor(Math.random() * messages.length)],
      //     actions: [
      //       {
      //         id: 'open-breathing',
      //         label: 'Start Breathing',
      //         icon: Wind,
      //         variant: 'primary',
      //         handler: () => {
      //           onNavigate?.('focus');
      //           // Could trigger breathing exercise specifically
      //         },
      //       },
      //       {
      //         id: 'snooze',
      //         label: 'Snooze 20m',
      //         icon: Clock,
      //         variant: 'ghost',
      //         handler: () => {
      //           // Will be handled by NotificationCard
      //         },
      //       },
      //     ],
      //     duration: 14000,
      //   });
        
      //   lastCheckRef.current.set('breathe', Date.now());
      // }
    };

    const interval = setInterval(checkBreathingPrompts, 120000); // Check every 2 minutes
    checkBreathingPrompts();
    
    return () => clearInterval(interval);
  }, [showNotification, , onNavigate]);

  // Gentle plan suggestions
  useEffect(() => {
    const checkGentlePlan = () => {
      const checkInData = JSON.parse(localStorage.getItem('flowstate-coaching-data') || '{}');
      const timeBlocks = JSON.parse(localStorage.getItem('flowstate-timeblocks') || '[]');
      const lastPlan = lastCheckRef.current.get('gentle-plan') || 0;
      const timeSinceLastPlan = Date.now() - lastPlan;
      
      // Check if low energy and no time blocks planned
      const hasLowEnergy = checkInData.energy <= 2;
      const hasNoPlannedBlocks = timeBlocks.length === 0;
      const hour = new Date().getHours();
      const isMorning = hour >= 7 && hour <= 10;
      
      if ((hasLowEnergy || (isMorning && hasNoPlannedBlocks)) && timeSinceLastPlan > 3600000) { // 1 hour cooldown
        const messages = {
          lowEnergy: 'You checked in with low energy. We made a gentle plan that honors where you\'re at today.',
          noBlocks: 'Morning is here. Want a realistic plan for today? Nothing intense—just what feels doable.',
          default: 'A gentle, adaptive plan is ready for you. Built around your energy, not against it.',
        };
        
        const message = hasLowEnergy ? messages.lowEnergy : (hasNoPlannedBlocks ? messages.noBlocks : messages.default);
        
        showNotification({
          type: 'gentle-plan',
          title: '📋 Gentle plan available',
          message,
          actions: [
            {
              id: 'view-plan',
              label: 'View Plan',
              icon: Calendar,
              variant: 'primary',
              handler: () => {
                onNavigate?.('timeflow');
              },
            },
            {
              id: 'open-coach',
              label: 'Ask Coach',
              icon: MessageCircleHeart,
              variant: 'secondary',
              handler: () => {
                onNavigate?.('coach-chat');
              },
            },
          ],
          duration: 16000,
        });
        
        lastCheckRef.current.set('gentle-plan', Date.now());
      }
    };

    const interval = setInterval(checkGentlePlan, 180000); // Check every 3 minutes
    checkGentlePlan();
    
    return () => clearInterval(interval);
  }, [showNotification, onNavigate]);

  // Focus window detection
  useEffect(() => {
    const checkFocusWindow = () => {
      const checkInData = JSON.parse(localStorage.getItem('flowstate-coaching-data') || '{}');
      const lastFocus = lastCheckRef.current.get('focus-window') || 0;
      const timeSinceLastFocus = Date.now() - lastFocus;
      
      const hour = new Date().getHours();
      const hasHighEnergy = checkInData.energy >= 4;
      const hasHighFocus = checkInData.focus >= 4;
      
      // Morning peak (9-11 AM) or high energy/focus
      const isMorningPeak = hour >= 9 && hour <= 11;
      const isInFlowState = hasHighEnergy && hasHighFocus;
      
      if ((isMorningPeak || isInFlowState) && timeSinceLastFocus > 7200000) { // 2 hour cooldown
        const messages = {
          morningPeak: 'This is your morning power window. Your mind is fresh and focused. Use it wisely.',
          flowState: 'You checked in with high energy AND focus. This is rare—protect this window for your most important work.',
          default: 'Peak focus window detected. What\'s the one thing that matters most right now?',
        };
        
        const message = isInFlowState ? messages.flowState : (isMorningPeak ? messages.morningPeak : messages.default);
        
        showNotification({
          type: 'focus-window',
          title: '⚡ Focus window open',
          message,
          actions: [
            {
              id: 'start-timer',
              label: 'Start Timer',
              icon: Brain,
              variant: 'primary',
              handler: () => {
                onNavigate?.('focus');
              },
            },
            {
              id: 'add-task',
              label: 'Add to Plan',
              icon: Plus,
              variant: 'secondary',
              handler: () => {
                onNavigate?.('timeflow');
              },
            },
          ],
          duration: 18000,
        });
        
        lastCheckRef.current.set('focus-window', Date.now());
      }
    };

    const interval = setInterval(checkFocusWindow, 300000); // Check every 5 minutes
    checkFocusWindow();
    
    return () => clearInterval(interval);
  }, [showNotification, onNavigate]);
}

// Enhanced Notification Display
export function EnhancedNotificationDisplay() {
  const { notifications, dismissNotification, snoozeNotification } = useNotifications();
  const { themeColors } = useTheme();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md pointer-events-none">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissNotification(notification.id)}
            onSnooze={() => snoozeNotification(notification.id)}
            themeColors={themeColors}
          />
        ))}
    </div>
  );
}

// Individual Notification Card
interface NotificationCardProps {
  notification: EnhancedNotification;
  onDismiss: () => void;
  onSnooze: () => void;
  themeColors: any;
}

function NotificationCard({ notification, onDismiss, onSnooze,  }: NotificationCardProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = notification.duration || 12000;
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(((steps - currentStep) / steps) * 100);
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [notification.duration]);

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'micro-win':
        return {
          gradient: 'from-purple-50/95 via-pink-50/95 to-purple-50/95',
          border: 'border-purple-200/50',
          icon: Sparkles,
          iconColor: '#a855f7',
          iconBg: '#f3e8ff',
        };
      case 'breathe':
        return {
          gradient: 'from-blue-50/95 via-cyan-50/95 to-blue-50/95',
          border: 'border-blue-200/50',
          icon: Wind,
          iconColor: '#3b82f6',
          iconBg: '#dbeafe',
        };
      case 'gentle-plan':
        return {
          gradient: 'from-amber-50/95 via-yellow-50/95 to-amber-50/95',
          border: 'border-amber-200/50',
          icon: Calendar,
          iconColor: '#f59e0b',
          iconBg: '#fef3c7',
        };
      case 'focus-window':
        return {
          gradient: 'from-emerald-50/95 via-green-50/95 to-emerald-50/95',
          border: 'border-emerald-200/50',
          icon: Brain,
          iconColor: '#10b981',
          iconBg: '#d1fae5',
        };
      default:
        return {
          gradient: 'from-gray-50/95 via-slate-50/95 to-gray-50/95',
          border: 'border-gray-200/50',
          icon: Bell,
          iconColor: '#6b7280',
          iconBg: '#f3f4f6',
        };
    }
  };

  const styles = getStyles(notification.type);
  const IconComponent = styles.icon;

  return (
    < div
      className="pointer-events-auto"
    >
      <div
        className={`bg-gradient-to-br ${styles.gradient} backdrop-blur-sm rounded-3xl shadow-2xl border-2 ${styles.border} overflow-hidden`}
        style={{ 
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        }}
      >
        {/* Main Content */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            < div
              className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: styles.iconBg }}
            >
              <IconComponent size={24} style={{ color: styles.iconColor }} />
            </ div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h4
                className="text-gray-900 mb-1.5"
              >
                {notification.title}
              </h4>
              
              <p
   
                className="text-sm text-gray-700 leading-relaxed mb-4"
              >
                {notification.message}
              </p>

              {/* Action Buttons */}
              {notification.actions && notification.actions.length > 0 && (
                < div

                  className="flex flex-wrap gap-2"
                >
                  {notification.actions.map((action, ) => {
                    const ActionIcon = action.icon;
                    const isPrimary = action.variant === 'primary';
                    const isGhost = action.variant === 'ghost';
                    
                    // Handle snooze action
                    const handleClick = () => {
                      if (action.id === 'snooze') {
                        onSnooze();
                      } else {
                        action.handler();
                        onDismiss();
                      }
                    };

                    return (
                      < button
                        key={action.id}

                        onClick={handleClick}
                        className={`
                          px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all
                          ${isPrimary ? 'bg-white/90 hover:bg-white shadow-sm' : ''}
                          ${isGhost ? 'bg-white/40 hover:bg-white/60' : ''}
                          ${!isPrimary && !isGhost ? 'bg-white/60 hover:bg-white/80' : ''}
                        `}
                        style={{
                          color: isPrimary ? styles.iconColor : '#374151',
                        }}
                      >
                        {ActionIcon && <ActionIcon size={14} />}
                        {action.label}
                      </ button>
                    );
                  })}
                </ div>
              )}
            </div>

            {/* Dismiss Button */}
            < button

              onClick={onDismiss}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/70 hover:bg-white transition-colors flex items-center justify-center group"
            >
              <X size={14} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
            </ button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/30 relative overflow-hidden">
          < div
            className="absolute inset-y-0 left-0 bg-white/60"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </ div>
  );
}

// Quick trigger functions for easy use
export function triggerMicroWinNotification(showNotification: NotificationContextType['showNotification'], onNavigate?: (screen: string) => void) {
  showNotification({
    type: 'micro-win',
    title: '✨ Micro-win time!',
    message: 'You just completed something. Ride that momentum!',
    actions: [
      {
        id: 'add-to-plan',
        label: 'Add to Plan',
        icon: Plus,
        variant: 'primary',
        handler: () => onNavigate?.('timeflow'),
      },
    ],
  });
}

export function triggerBreatheNotification(showNotification: NotificationContextType['showNotification'], onNavigate?: (screen: string) => void) {
  showNotification({
    type: 'breathe',
    title: '🫁 Time to breathe',
    message: 'Pause. Three deep breaths. You\'ve got this.',
    actions: [
      {
        id: 'start-breathing',
        label: 'Start Breathing',
        icon: Wind,
        variant: 'primary',
        handler: () => onNavigate?.('focus'),
      },
    ],
  });
}

export function triggerGentlePlanNotification(showNotification: NotificationContextType['showNotification'], onNavigate?: (screen: string) => void) {
  showNotification({
    type: 'gentle-plan',
    title: '📋 Gentle plan available',
    message: 'A realistic plan for today, built around your energy.',
    actions: [
      {
        id: 'view-plan',
        label: 'View Plan',
        icon: Calendar,
        variant: 'primary',
        handler: () => onNavigate?.('timeflow'),
      },
    ],
  });
}

export function triggerFocusWindowNotification(showNotification: NotificationContextType['showNotification'], onNavigate?: (screen: string) => void) {
  showNotification({
    type: 'focus-window',
    title: '⚡ Focus window open',
    message: 'Your mind is sharp right now. Use this wisely.',
    actions: [
      {
        id: 'start-timer',
        label: 'Start Timer',
        icon: Brain,
        variant: 'primary',
        handler: () => onNavigate?.('focus'),
      },
    ],
  });
}
