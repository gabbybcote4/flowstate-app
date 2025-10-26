// src/components/onboarding/steps/WelcomeStep.tsx
// welcome step of onboarding wizard
import React from 'react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { Sparkles, Zap, Heart, Shield } from 'lucide-react';

export function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <div className="space-y-8 text-center">

      {/* hero */}
      <div
      >
        <div
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
        >
        </div>
        <p className="text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
          Let’s create a gentle, personalized routine that flexes with your mood
          and energy. 
        </p>
      </div>

      {/* highlights */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
      >
        {[
          { icon: Zap, title: 'Customizable', text: 'Tailor everything to your pace' },
          { icon: Heart, title: 'Energy-Aware', text: 'Flow adjusts to how you feel' },
          { icon: Shield, title: 'Private', text: 'Your data stays with you' },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl p-5 flow-card"
          >
            <Icon size={28} className="mx-auto mb-3 text-purple-400" />
            <h3 className="font-medium text-purple-700 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{text}</p>
          </div>
        ))}
      </div>

      {/* action */}
      <div
        className="pt-4"
      >
        <p className="text-xs text-gray-400 mt-3">
          This takes less than 2 minutes — you can adjust anything later.
        </p>
      </div>
    </div>
  );
}
