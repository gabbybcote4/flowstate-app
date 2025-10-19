import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { TonePreference } from '../../../config/userConfig.types';
import { Heart, Zap, Briefcase, Smile } from 'lucide-react';

const TONE_OPTIONS: Array<{
  value: TonePreference;
  label: string;
  icon: any;
  description: string;
  example: string;
}> = [
  {
    value: 'gentle',
    label: 'Gentle & Compassionate',
    icon: Heart,
    description: 'Soft, supportive language with lots of encouragement',
    example: '"You\'re doing great. Let\'s take this one step at a time. 💜"',
  },
  {
    value: 'motivating',
    label: 'Motivating & Energetic',
    icon: Zap,
    description: 'Upbeat and inspiring to keep you moving forward',
    example: '"You\'ve got this! Let\'s crush today\'s goals together! 🚀"',
  },
  {
    value: 'practical',
    label: 'Practical & Direct',
    icon: Briefcase,
    description: 'Clear, straightforward guidance without fluff',
    example: '"3 tasks remaining. Start with the easiest one."',
  },
  {
    value: 'playful',
    label: 'Playful & Fun',
    icon: Smile,
    description: 'Light-hearted with a touch of personality',
    example: '"Look at you go! Time to level up? 🎮✨"',
  },
];

export function ToneStep({ }: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const handleSelectTone = (tone: TonePreference) => {
    updateConfig({ tone });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          How would you like FlowState to communicate with you? This affects all messages, coaching, and encouragement throughout the app.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TONE_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          const isSelected = config.tone === option.value;

          return (
            < button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectTone(option.value)}
              className="rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-lg"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)'
                  : 'white',
                border: isSelected
                  ? '2px solid transparent'
                  : '2px solid rgba(167, 139, 250, 0.2)',
                color: isSelected ? 'white' : 'inherit',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected
                  ? '0 10px 40px rgba(167, 139, 250, 0.3)'
                  : '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Icon */}
              <div className="mb-4">
                <Icon 
                  size={32} 
                  style={{ 
                    color: isSelected ? 'white' : '#A78BFA',
                    opacity: isSelected ? 1 : 0.8 
                  }}
                />
              </div>

              {/* Title */}
              <h3 
                className="mb-2"
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  opacity: isSelected ? 1 : 0.9
                }}
              >
                {option.label}
              </h3>

              {/* Description */}
              <p 
                className="mb-3"
                style={{
                  fontSize: '14px',
                  opacity: isSelected ? 0.9 : 0.6,
                  lineHeight: '1.5'
                }}
              >
                {option.description}
              </p>

              {/* Example */}
              <div 
                className="rounded-2xl p-3 text-sm italic"
                style={{
                  background: isSelected 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgba(167, 139, 250, 0.05)',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}
              >
                {option.example}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                < div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A78BFA' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Selected</span>
                </ div>
              )}
            </ button>
          );
        })}
      </div>

      {/* Helper Text */}
      < div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-sm opacity-50">
          Don't worry, you can change this anytime in Settings
        </p>
      </ div>
    </div>
  );
}