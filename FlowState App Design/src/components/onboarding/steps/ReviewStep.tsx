// src/components/onboarding/steps/ReviewStep.tsx
// final review step of onboarding wizard
import React from 'react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { FEATURE_REGISTRY } from '../../../config/featureRegistry';
import { Check } from 'lucide-react';

export function ReviewStep({ onNext, onBack }: OnboardingStepProps) {
  const { config } = useUserConfig();

  const enabledFeatures = Object.entries(config.enabledFeatures)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => FEATURE_REGISTRY[key]?.label)
    .filter(Boolean);

  const enabledWidgets = Object.entries(config.widgets)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key)
    .filter(Boolean);

  return (
    <div className="space-y-8">

      {/* hero */}
      <div
        className="text-center"
      >
        <div 
          className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
        >
        </div>
        <h1 
          className="mb-2"
          style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#6B21A8',
          }}
        >
          You're All Set!
        </h1>
        <p className="opacity-70">
          Here's what we've built for you
        </p>
      </ div>

      {/* summary grid */}
      <div
        className="grid grid-cols-1 gap-4"
      >
        {/* features */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: 'white',
            border: '1px solid rgba(167, 139, 250, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Check size={16} style={{ color: '#10B981' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600' }}>
              {enabledFeatures.length} Features Enabled
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {enabledFeatures.slice(0, 5).map(feature => (
              <span 
                key={feature}
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(var(--color-primary-rgb, 167,139,250), 0.12)',
                  border: '1px solid var(--color-accent)',
                }}
              >
                {feature}
              </span>
            ))}
            {enabledFeatures.length > 5 && (
              <span className="text-xs opacity-50">
                +{enabledFeatures.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* widgets */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: 'white',
            border: '1px solid rgba(167, 139, 250, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Check size={16} style={{ color: '#10B981' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600' }}>
              {enabledWidgets.length} Widgets Active
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {enabledWidgets.slice(0, 5).map(widget => (
              <span 
                key={widget}
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(var(--color-primary-rgb, 167,139,250), 0.12)',
                  border: '1px solid var(--color-accent)',
                }}
              >
                {widget}
              </span>
            ))}
          </div>
        </div>

        {/* theme */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: 'white',
            border: '1px solid rgba(167, 139, 250, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Check size={16} style={{ color: '#10B981' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Theme & Tone</h4>
          </div>
          <p className="text-sm opacity-60">
            {config.theme.mode} mode • {config.tone} tone
          </p>
        </div>

        {/* notifications */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: 'white',
            border: '1px solid rgba(167, 139, 250, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Check size={16} style={{ color: '#10B981' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Notifications</h4>
          </div>
          <p className="text-sm opacity-60">
            {config.notifications.enabled ? config.notifications.frequency : 'Disabled'}
          </p>
        </div>
      </ div>

      {/* edit text */}
      <div
        className="text-center"
      >
        <p className="text-sm opacity-50 mt-4">
          You can customize everything later in Settings
        </p>
      </ div>
    </div>
  );
}