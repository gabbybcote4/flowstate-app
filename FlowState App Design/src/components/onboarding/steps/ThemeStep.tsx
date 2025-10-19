import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { ThemeMode } from '../../../config/userConfig.types';
import { Sun, Moon, Minimize2, Sparkles } from 'lucide-react';

const THEME_OPTIONS: Array<{
  value: ThemeMode;
  label: string;
  icon: any;
  description: string;
  preview: {
    background: string;
    cardBg: string;
    text: string;
  };
}> = [
  {
    value: 'light',
    label: 'Light Mode',
    icon: Sun,
    description: 'Bright and airy, perfect for daytime',
    preview: {
      background: 'linear-gradient(135deg, #FAF5FF 0%, #FFF7ED 100%)',
      cardBg: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    value: 'dark',
    label: 'Dark Mode',
    icon: Moon,
    description: 'Easy on the eyes in low light',
    preview: {
      background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      cardBg: '#374151',
      text: '#F9FAFB',
    },
  },
  {
    value: 'minimal',
    label: 'Minimal Mode',
    icon: Minimize2,
    description: 'Ultra-clean for migraine-friendly focus',
    preview: {
      background: '#FFFFFF',
      cardBg: '#F9FAFB',
      text: '#374151',
    },
  },
  {
    value: 'auto',
    label: 'Auto (System)',
    icon: Sparkles,
    description: 'Follows your device settings',
    preview: {
      background: 'linear-gradient(135deg, #FAF5FF 0%, #1F2937 100%)',
      cardBg: '#E5E7EB',
      text: '#1F2937',
    },
  },
];

const COLOR_OPTIONS = [
  { value: '#A78BFA', label: 'Lavender', color: '#A78BFA' },
  { value: '#C084FC', label: 'Purple', color: '#C084FC' },
  { value: '#FBCFE8', label: 'Pink', color: '#FBCFE8' },
  { value: '#FED7AA', label: 'Peach', color: '#FED7AA' },
  { value: '#A7F3D0', label: 'Mint', color: '#A7F3D0' },
  { value: '#93C5FD', label: 'Sky', color: '#93C5FD' },
];

export function ThemeStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const handleSelectTheme = (mode: ThemeMode) => {
    updateConfig({ 
      theme: { ...config.theme, mode } 
    });
  };

  const handleSelectColor = (color: string) => {
    updateConfig({ 
      theme: { ...config.theme, primaryColor: color } 
    });
  };

  return (
    <div className="space-y-8">
      {/* Theme Mode Selection */}
      <div>
        <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: '600' }}>
          Choose Your Theme
        </h3>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Select the visual mode that's most comfortable for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_OPTIONS.map((option, index) => {
            const Icon = option.icon;
            const isSelected = config.theme.mode === option.value;

            return (
              < button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectTheme(option.value)}
                className="rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  border: isSelected
                    ? '3px solid #A78BFA'
                    : '2px solid rgba(167, 139, 250, 0.2)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected
                    ? '0 10px 40px rgba(167, 139, 250, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Preview */}
                <div 
                  className="h-32 p-4 flex items-center justify-center"
                  style={{ background: option.preview.background }}
                >
                  <div 
                    className="w-full h-full rounded-2xl p-3 flex flex-col"
                    style={{ 
                      background: option.preview.cardBg,
                      color: option.preview.text 
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: config.theme.primaryColor }}
                      >
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div 
                          className="h-2 rounded mb-1" 
                          style={{ 
                            background: option.preview.text,
                            opacity: 0.6,
                            width: '60%' 
                          }}
                        />
                        <div 
                          className="h-2 rounded" 
                          style={{ 
                            background: option.preview.text,
                            opacity: 0.3,
                            width: '40%' 
                          }}
                        />
                      </div>
                    </div>
                    <div 
                      className="h-8 rounded-xl mt-auto"
                      style={{ 
                        background: config.theme.primaryColor,
                        opacity: 0.2 
                      }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div 
                  className="p-4 text-left"
                  style={{
                    background: isSelected ? '#F3F4F6' : 'white',
                  }}
                >
                  <h4 
                    style={{ 
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}
                  >
                    {option.label}
                  </h4>
                  <p 
                    style={{ 
                      fontSize: '13px',
                      opacity: 0.6 
                    }}
                  >
                    {option.description}
                  </p>
                </div>
              </ button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: '600' }}>
          Choose Your Accent Color
        </h3>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          This color will be used throughout the app for highlights and accents.
        </p>

        <div className="flex flex-wrap gap-3">
          {COLOR_OPTIONS.map((option, index) => {
            const isSelected = config.theme.primaryColor === option.value;

            return (
              < button
                key={option.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => handleSelectColor(option.value)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                style={{
                  background: isSelected ? 'rgba(167, 139, 250, 0.1)' : 'transparent',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full transition-all"
                  style={{
                    backgroundColor: option.color,
                    border: isSelected ? '3px solid #6B21A8' : '2px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: isSelected ? `0 4px 20px ${option.color}80` : 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                <span 
                  style={{ 
                    fontSize: '12px',
                    fontWeight: isSelected ? '600' : '400',
                    opacity: isSelected ? 1 : 0.6
                  }}
                >
                  {option.label}
                </span>
              </ button>
            );
          })}
        </div>
      </div>

      {/* Helper Text */}
      < div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-sm opacity-50">
          Your theme choices are reflected in the live preview on the right →
        </p>
      </ div>
    </div>
  );
}
