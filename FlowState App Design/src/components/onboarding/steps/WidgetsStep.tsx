// src/components/onboarding/steps/WidgetsStep.tsx
// Onboarding step for selecting dashboard widgets
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { Switch } from '../../ui/switch';
import { Cloud, Moon, Heart, BarChart3, CheckSquare, Target, Clock, Sparkles, TrendingUp } from 'lucide-react';

const WIDGET_OPTIONS = [
  { key: 'weather', label: 'Weather', icon: Cloud, description: 'Current weather conditions' },
  { key: 'moon', label: 'Moon Phase', icon: Moon, description: 'Track lunar cycles' },
  { key: 'healthStats', label: 'Health Stats', icon: Heart, description: 'Activity and health data' },
  { key: 'weeklySummary', label: 'Weekly Summary', icon: BarChart3, description: 'Your week at a glance' },
  { key: 'todos', label: 'To-Dos', icon: CheckSquare, description: 'Quick access to tasks' },
  { key: 'habits', label: 'Habits', icon: Target, description: 'Habit tracking' },
  { key: 'focusTimer', label: 'Focus Timer', icon: Clock, description: 'Pomodoro and focus modes' },
  { key: 'aiInsights', label: 'AI Insights', icon: Sparkles, description: 'Personalized suggestions' },
  { key: 'momentum', label: 'Momentum Ring', icon: TrendingUp, description: 'Daily progress ring' },
];

export function WidgetsStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const toggleWidget = (key: string) => {
    updateConfig({
      widgets: {
        ...config.widgets,
        [key]: !config.widgets[key as keyof typeof config.widgets],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Select which widgets to show on your dashboard. Don't worry, you can change this later.
        </p>
      </div>

      <div className="space-y-2">
        {WIDGET_OPTIONS.map((widget, index) => {
          const Icon = widget.icon;
          const isEnabled = config.widgets[widget.key as keyof typeof config.widgets];

          return (
            <motion.div
              key={widget.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl p-4 flex items-center gap-4 transition-all"
              style={{
                background: isEnabled ? 'rgba(167, 139, 250, 0.05)' : 'white',
                border: isEnabled
                  ? '2px solid rgba(167, 139, 250, 0.2)'
                  : '2px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: isEnabled
                    ? 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)'
                    : 'rgba(167, 139, 250, 0.1)',
                }}
              >
                <Icon 
                  size={20} 
                  style={{ color: isEnabled ? 'white' : '#A78BFA' }}
                />
              </div>

              <div className="flex-1">
                <h4 style={{ fontSize: '15px', fontWeight: '500' }}>
                  {widget.label}
                </h4>
                <p className="text-sm opacity-60">{widget.description}</p>
              </div>

              <Switch
                checked={isEnabled}
                onCheckedChange={() => toggleWidget(widget.key)}
              />
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm opacity-50 text-center">
        {Object.values(config.widgets).filter(Boolean).length} widgets enabled
      </p>
    </div>
  );
}
