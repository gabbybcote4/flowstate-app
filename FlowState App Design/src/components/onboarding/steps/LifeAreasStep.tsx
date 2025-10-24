// src/components/onboarding/steps/LifeAreasStep.tsx

import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { Check } from 'lucide-react';

export function LifeAreasStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const toggleLifeArea = (id: string) => {
    const updatedAreas = config.lifeAreas.map(area =>
      area.id === id ? { ...area, enabled: !area.enabled } : area
    );
    updateConfig({ lifeAreas: updatedAreas });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Which areas of your life do you want to track and improve? Select 3-5 for best results.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {config.lifeAreas.map((area, index) => (
          < button
            key={area.id}
            onClick={() => toggleLifeArea(area.id)}
            className="rounded-2xl p-4 text-center transition-all"
            style={{
              background: area.enabled
                ? `linear-gradient(135deg, ${area.color}20 0%, ${area.color}10 100%)`
                : 'white',
              border: area.enabled
                ? `2px solid ${area.color}`
                : '2px solid rgba(0, 0, 0, 0.1)',
              transform: area.enabled ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <div className="text-3xl mb-2">{area.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{area.label}</div>
            {area.enabled && (
              <div
                className="mt-2 mx-auto w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: area.color }}
              >
                <Check size={14} className="text-white" />
              </ div>
            )}
          </ button>
        ))}
      </div>

      <p className="text-sm opacity-50 text-center">
        {config.lifeAreas.filter(a => a.enabled).length} areas selected
      </p>
    </div>
  );
}
