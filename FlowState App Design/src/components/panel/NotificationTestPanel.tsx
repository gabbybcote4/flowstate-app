import { useState } from 'react';
import { useNotifications } from './system/EnhancedNotificationSystem';
import { useTheme } from './context/ThemeContext';
import { motion } from 'motion/react';
import {
  Sparkles,
  Wind,
  Calendar,
  Brain,
  Plus,
  Clock,
  MessageCircleHeart,
  Target,
  Bell,
  BellOff,
} from 'lucide-react';

/**
 * Notification Test Panel
 * 
 * Testing UI for the Enhanced Notification System
 * Can be added to Settings or accessed via a debug mode
 */

export function NotificationTestPanel({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const { showNotification, notifications, clearAll } = useNotifications();
  const { themeColors } = useTheme();
  const [selectedType, setSelectedType] = useState<'micro-win' | 'breathe' | 'gentle-plan' | 'focus-window'>('micro-win');

  const triggerTestNotification = (type: typeof selectedType) => {
    const notificationConfigs = {
      'micro-win': {
        type: 'micro-win' as const,
        title: '✨ Micro-win time!',
        message: 'You just completed something. That momentum? Keep it going with one more tiny win.',
        actions: [
          {
            id: 'add-to-plan',
            label: 'Add to Plan',
            icon: Plus,
            variant: 'primary' as const,
            handler: () => onNavigate?.('timeflow'),
          },
          {
            id: 'view-habits',
            label: 'View Habits',
            icon: Target,
            variant: 'secondary' as const,
            handler: () => onNavigate?.('habits'),
          },
          {
            id: 'snooze',
            label: 'Snooze 20m',
            icon: Clock,
            variant: 'ghost' as const,
            handler: () => {},
          },
        ],
        duration: 15000,
      },
      'breathe': {
        type: 'breathe' as const,
        title: '🫁 Time to breathe',
        message: 'Your mind needs a reset. Three deep breaths can shift everything.',
        actions: [
          {
            id: 'start-breathing',
            label: 'Start Breathing',
            icon: Wind,
            variant: 'primary' as const,
            handler: () => onNavigate?.('focus'),
          },
          {
            id: 'snooze',
            label: 'Snooze 20m',
            icon: Clock,
            variant: 'ghost' as const,
            handler: () => {},
          },
        ],
        duration: 14000,
      },
      'gentle-plan': {
        type: 'gentle-plan' as const,
        title: '📋 Gentle plan available',
        message: 'A gentle, adaptive plan is ready for you. Built around your energy, not against it.',
        actions: [
          {
            id: 'view-plan',
            label: 'View Plan',
            icon: Calendar,
            variant: 'primary' as const,
            handler: () => onNavigate?.('timeflow'),
          },
          {
            id: 'open-coach',
            label: 'Ask Coach',
            icon: MessageCircleHeart,
            variant: 'secondary' as const,
            handler: () => onNavigate?.('coach-chat'),
          },
          {
            id: 'snooze',
            label: 'Snooze 20m',
            icon: Clock,
            variant: 'ghost' as const,
            handler: () => {},
          },
        ],
        duration: 16000,
      },
      'focus-window': {
        type: 'focus-window' as const,
        title: '⚡ Focus window open',
        message: 'You checked in with high energy AND focus. This is rare—protect this window for your most important work.',
        actions: [
          {
            id: 'start-timer',
            label: 'Start Timer',
            icon: Brain,
            variant: 'primary' as const,
            handler: () => onNavigate?.('focus'),
          },
          {
            id: 'add-task',
            label: 'Add to Plan',
            icon: Plus,
            variant: 'secondary' as const,
            handler: () => onNavigate?.('timeflow'),
          },
          {
            id: 'snooze',
            label: 'Snooze 20m',
            icon: Clock,
            variant: 'ghost' as const,
            handler: () => {},
          },
        ],
        duration: 18000,
      },
    };

    showNotification(notificationConfigs[type]);
  };

  const notificationTypes = [
    {
      id: 'micro-win' as const,
      label: 'Micro-win',
      icon: Sparkles,
      color: '#a855f7',
      description: 'Celebrate small achievements',
    },
    {
      id: 'breathe' as const,
      label: 'Breathe',
      icon: Wind,
      color: '#3b82f6',
      description: 'Mindful breathing prompts',
    },
    {
      id: 'gentle-plan' as const,
      label: 'Gentle Plan',
      icon: Calendar,
      color: '#f59e0b',
      description: 'AI-generated adaptive plans',
    },
    {
      id: 'focus-window' as const,
      label: 'Focus Window',
      icon: Brain,
      color: '#10b981',
      description: 'Optimal productivity periods',
    },
  ];

  return (
    <div className="bg-[var(--color-card)] rounded-3xl shadow-sm p-6 border border-[var(--color-ring-offset-background)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="mb-1">Notification Test Panel</h3>
          <p className="text-sm opacity-60">Test the enhanced notification system</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-gray-100 rounded-full text-xs">
            {notifications.length} active
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs hover:bg-red-100 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Notification Type Selector */}
      <div className="mb-6">
        <p className="text-sm mb-3 opacity-70">Select notification type:</p>
        <div className="grid grid-cols-2 gap-3">
          {notificationTypes.map((type) => {
            const IconComponent = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              < button
                key={type.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type.id)}
                className={`
                  p-4 rounded-2xl border-2 transition-all text-left
                  ${isSelected 
                    ? 'border-current shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                style={{
                  color: isSelected ? type.color : '#6b7280',
                  backgroundColor: isSelected ? `${type.color}10` : 'transparent',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}20` }}
                  >
                    <IconComponent size={20} style={{ color: type.color }} />
                  </div>
                  <div>
                    <p className="text-sm">{type.label}</p>
                  </div>
                </div>
                <p className="text-xs opacity-70">{type.description}</p>
              </ button>
            );
          })}
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={() => triggerTestNotification(selectedType)}
        className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
        style={{
          backgroundColor: themeColors.primary,
          color: 'white',
        }}
      >
        <Bell size={20} />
        <span>Trigger {notificationTypes.find(t => t.id === selectedType)?.label} Notification</span>
      </button>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Bell size={12} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-900 mb-2">
              <strong>Features:</strong>
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Translucent</strong> gradient backgrounds</li>
              <li>• <strong>Slow fade-out</strong> with progress bar</li>
              <li>• <strong>Action buttons</strong>: Add to Plan, Snooze 20m, Open Coach</li>
              <li>• <strong>Smart triggers</strong>: Auto-detects micro-wins, energy levels, focus windows</li>
              <li>• <strong>Gentle UX</strong>: Non-intrusive, compassionate messaging</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Smart Triggers Info */}
      <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-200">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles size={12} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-purple-900 mb-2">
              <strong>Auto-Triggered When:</strong>
            </p>
            <ul className="text-xs text-purple-800 space-y-1">
              <li>• <strong>Micro-win:</strong> After completing habits/todos</li>
              <li>• <strong>Breathe:</strong> Afternoon slump (2-4 PM) or anxious state</li>
              <li>• <strong>Gentle Plan:</strong> Low energy check-in or morning without plans</li>
              <li>• <strong>Focus Window:</strong> Morning peak (9-11 AM) or high energy+focus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
