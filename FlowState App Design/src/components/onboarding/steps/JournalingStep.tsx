import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { Switch } from '../../ui/switch';
import { Book, Lightbulb, Sun, Heart, FileText } from 'lucide-react';

const JOURNALING_OPTIONS = [
  { key: 'enabled', label: 'Enable Journaling', icon: Book, description: 'Turn on journaling features' },
  { key: 'prompts', label: 'Guided Prompts', icon: Lightbulb, description: 'Daily writing prompts' },
  { key: 'dailyReflection', label: 'Daily Reflection', icon: Sun, description: 'End-of-day reflection' },
  { key: 'gratitude', label: 'Gratitude Practice', icon: Heart, description: 'Daily gratitude entries' },
  { key: 'morningPages', label: 'Morning Pages', icon: FileText, description: 'Free-form morning writing' },
];

export function JournalingStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const toggleJournaling = (key: string) => {
    updateConfig({
      journaling: {
        ...config.journaling,
        [key]: !config.journaling[key as keyof typeof config.journaling],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Journaling can help you process emotions and track patterns. Choose what feels right for you.
        </p>
      </div>

      <div className="space-y-2">
        {JOURNALING_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          const isEnabled = config.journaling[option.key as keyof typeof config.journaling];
          const isMainToggle = option.key === 'enabled';

          return (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: isEnabled ? 'rgba(167, 139, 250, 0.05)' : 'white',
                border: isEnabled
                  ? '2px solid rgba(167, 139, 250, 0.2)'
                  : '2px solid rgba(0, 0, 0, 0.05)',
                opacity: !isMainToggle && !config.journaling.enabled ? 0.4 : 1,
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
                  {option.label}
                </h4>
                <p className="text-sm opacity-60">{option.description}</p>
              </div>

              <Switch
                checked={isEnabled}
                onCheckedChange={() => toggleJournaling(option.key)}
                disabled={!isMainToggle && !config.journaling.enabled}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
