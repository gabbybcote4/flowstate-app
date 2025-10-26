// src/components/onboarding/steps/ToneStep.tsx
import React from "react";
import { OnboardingStepProps } from "../ConfigOnboardingWizard";
import { useUserConfig } from "../../../config/UserConfigContext";
import { TonePreference } from "../../../config/userConfig.types";
import { Heart, Zap, Briefcase, Smile, Check } from "lucide-react";

const TONE_OPTIONS: Array<{
  value: TonePreference;
  label: string;
  icon: any;
  description: string;
  example: string;
}> = [
  {
    value: "gentle",
    label: "Gentle & Compassionate",
    icon: Heart,
    description: "Soft, supportive language with lots of encouragement.",
    example: "“You’re doing great. Let’s take this one step at a time.” 💜",
  },
  {
    value: "motivating",
    label: "Motivating & Energetic",
    icon: Zap,
    description: "Upbeat and inspiring to keep you moving forward.",
    example: "“You’ve got this! Let’s crush today’s goals together!” 🚀",
  },
  {
    value: "practical",
    label: "Practical & Direct",
    icon: Briefcase,
    description: "Clear, straightforward guidance without fluff.",
    example: "“3 tasks remaining. Start with the easiest one.”",
  },
  {
    value: "playful",
    label: "Playful & Fun",
    icon: Smile,
    description: "Light-hearted with a touch of personality.",
    example: "“Look at you go! Time to level up? 🎮✨”",
  },
];

export function ToneStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const handleSelectTone = (tone: TonePreference) => {
    updateConfig({ tone });
  };

  return (
    <div className="space-y-6">
      <p className="opacity-70 mb-6 text-[15px] leading-relaxed text-[var(--color-card-foreground)]">
        How would you like FlowState to communicate with you? This affects all
        messages, coaching, and encouragement throughout the app.
      </p>

      <div className="grid grid-cols-1 gap-2">
        {TONE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = config.tone === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleSelectTone(option.value)}
              className={`relative group p-3 rounded-2xl text-left border transition-all duration-300
                ${
                  isSelected
                    ? "border-transparent bg-gradient-to-br from-[var(--color-primary)] to-[#C084FC] text-white shadow-[0_6px_20px_rgba(167,139,250,0.3)] scale-[1.01]"
                    : "border-[var(--color-ring-offset-background)] bg-[var(--color-card)] hover:shadow-md hover:scale-[1.01]"
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[var(--color-primary-light)]/20 text-[var(--color-primary)]"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 text-[16px] ${
                      isSelected
                        ? "text-white"
                        : "text-[var(--color-card-foreground)]"
                    }`}
                  >
                    {option.label}
                  </h3>
                  <p
                    className={`text-sm leading-snug ${
                      isSelected
                        ? "text-white/80"
                        : "text-[var(--color-muted-foreground)]"
                    }`}
                  >
                    {option.description}
                  </p>

                  <div
                    className={`mt-3 rounded-xl p-2.5 text-sm italic transition-colors ${
                      isSelected
                        ? "bg-white/20 text-white/90"
                        : "bg-[var(--color-primary-light)]/10 text-[var(--color-muted-foreground)]"
                    }`}
                  >
                    {option.example}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 bg-white/30 rounded-full p-1.5">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm opacity-60 mt-6">
        You can change this anytime in Settings
      </p>
    </div>
  );
}
