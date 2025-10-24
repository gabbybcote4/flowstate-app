// src/components/onboarding/ConfigOnboardingWizard.tsx
import { useState, useEffect } from "react";
import { useUserConfig } from "../../config/UserConfigContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

// step imports
import { WelcomeStep } from "./steps/WelcomeStep";
import { ToneStep } from "./steps/ToneStep";
import { ThemeStep } from "./steps/ThemeStep";
import { LifeAreasStep } from "./steps/LifeAreasStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { DashboardLayoutStep } from "./steps/DashboardLayoutStep";
import { NotificationsStep } from "./steps/NotificationsStep";
import { ReviewStep } from "./steps/ReviewStep";

export interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ONBOARDING_STEPS = [
  { id: "welcome", title: "Welcome to FlowState", component: WelcomeStep },
  { id: "tone", title: "Your Tone", component: ToneStep },
  { id: "theme", title: "Theme", component: ThemeStep },
  { id: "lifeAreas", title: "Focus Areas", component: LifeAreasStep },
  { id: "features", title: "Features You’ll Use", component: FeaturesStep },
  { id: "layout", title: "Dashboard Setup", component: DashboardLayoutStep },
  { id: "notifications", title: "Reminders & Journaling", component: NotificationsStep },
  { id: "review", title: "Review & Apply", component: ReviewStep },
];

interface ConfigOnboardingWizardProps {
  onComplete: () => void;
  editMode?: string;
}

export function ConfigOnboardingWizard({ onComplete, editMode }: ConfigOnboardingWizardProps) {
  const { config, updateConfig } = useUserConfig();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
  if (editMode === "layout") {
    const layoutIndex = ONBOARDING_STEPS.findIndex((s) => s.id === "layout");
    if (layoutIndex !== -1) setCurrentStepIndex(layoutIndex);
  }
}, [editMode]);


  // restore saved step from config
  useEffect(() => {
    if (config.onboardingStep && config.onboardingStep < ONBOARDING_STEPS.length) {
      setCurrentStepIndex(config.onboardingStep);
    }
  }, [config.onboardingStep]);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const StepComponent = currentStep.component;

  const handleNext = () => {
    if (currentStepIndex === ONBOARDING_STEPS.length - 1) {
      updateConfig({
        onboardingCompleted: true,
        onboardingStep: ONBOARDING_STEPS.length,
      });
      onComplete();
    } else {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      updateConfig({ onboardingStep: next });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prev = currentStepIndex - 1;
      setCurrentStepIndex(prev);
      updateConfig({ onboardingStep: prev });
    }
  };

  const handleSkip = () => {
    updateConfig({
      onboardingCompleted: true,
      onboardingStep: ONBOARDING_STEPS.length,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-peach-50 flex flex-col">
      
      {/* progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full rounded-r-full transition-none"
          style={{
            width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%`,
            background: "linear-gradient(90deg, #A78BFA 0%, #C084FC 100%)",
          }}
        />
      </div>

      {/* step content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-sm opacity-50">
            Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-purple-700">
            {currentStep.title}
          </h2>

          <div className="mt-6">
            <StepComponent
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentStepIndex === 0}
              isLast={currentStepIndex === ONBOARDING_STEPS.length - 1}
            />
          </div>
        </div>
      </div>

      {/* footer navigation */}
      <div className="border-t border-gray-200 bg-[var(--color-card)]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="rounded-2xl"
          >
            <ChevronLeft size={20} />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`rounded-full ${
                  index === currentStepIndex ? "w-8 bg-purple-400" : "w-2 bg-purple-200"
                }`}
                style={{ height: "8px" }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="rounded-2xl text-gray-600"
            >
              Skip for now
            </Button>

            <Button
              onClick={handleNext}
              className="rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)",
                color: "white",
              }}
            >
              {currentStepIndex === ONBOARDING_STEPS.length - 1
                ? "Build My Flow"
                : "Next"}
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
