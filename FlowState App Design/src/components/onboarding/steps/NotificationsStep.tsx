import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { Switch } from '../../ui/switch';
import { Bell, BellOff, Activity, Target, Heart, Lightbulb } from 'lucide-react';

export function NotificationsStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const toggleNotification = (key: string) => {
    updateConfig({
      notifications: {
        ...config.notifications,
        [key]: !config.notifications[key as keyof typeof config.notifications],
      },
    });
  };

  const setFrequency = (frequency: 'minimal' | 'moderate' | 'frequent') => {
    updateConfig({
      notifications: { ...config.notifications, frequency },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          We'll never spam you. Choose gentle reminders that support your flow, not disrupt it.
        </p>
      </div>

      {/* Main Toggle */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: config.notifications.enabled
            ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)'
            : 'white',
          border: '2px solid rgba(167, 139, 250, 0.2)',
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          {config.notifications.enabled ? (
            <Bell size={24} style={{ color: '#A78BFA' }} />
          ) : (
            <BellOff size={24} className="opacity-30" />
          )}
          <div className="flex-1">
            <h4 style={{ fontSize: '16px', fontWeight: '600' }}>
              Enable Notifications
            </h4>
            <p className="text-sm opacity-60">Turn on gentle reminders</p>
          </div>
          <Switch
            checked={config.notifications.enabled}
            onCheckedChange={() => toggleNotification('enabled')}
          />
        </div>
      </div>

      {/* Notification Types */}
      {config.notifications.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {[
            { key: 'checkInReminders', label: 'Check-In Reminders', icon: Activity },
            { key: 'habitReminders', label: 'Habit Reminders', icon: Target },
            { key: 'encouragement', label: 'Encouragement', icon: Heart },
            { key: 'insights', label: 'Insights & Tips', icon: Lightbulb },
          ].map((item, index) => {
            const Icon = item.icon;
            const isEnabled = config.notifications[item.key as keyof typeof config.notifications];

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{
                  background: isEnabled ? 'rgba(167, 139, 250, 0.05)' : 'white',
                  border: '2px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <Icon size={20} style={{ color: '#A78BFA' }} />
                <div className="flex-1">
                  <h5 style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</h5>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => toggleNotification(item.key)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Frequency */}
      {config.notifications.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="mb-3" style={{ fontSize: '15px', fontWeight: '500' }}>
            Notification Frequency
          </h4>
          <div className="flex gap-2">
            {(['minimal', 'moderate', 'frequent'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setFrequency(freq)}
                className="flex-1 py-3 px-4 rounded-2xl transition-all"
                style={{
                  background: config.notifications.frequency === freq
                    ? 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)'
                    : 'white',
                  color: config.notifications.frequency === freq ? 'white' : 'inherit',
                  border: '2px solid rgba(167, 139, 250, 0.2)',
                }}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
