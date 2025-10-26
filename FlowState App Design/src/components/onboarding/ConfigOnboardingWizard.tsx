// src/components/onboarding/ConfigOnboardingWizard.tsx
// onboarding wizard for initial user configuration
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
          <p className="text-sm opacity-50 items-center justify-center flex">
            Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-purple-700 items-center justify-center flex">
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
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-ring-offset-background)] bg-[var(--color-card)]/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto w-full max-w-md sm:max-w-3xl px-4 py-3 flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between sm:gap-3">
          
          {/* top row: back + progress + next */}
          <div className="flex w-full items-center justify-between sm:justify-between">

            {/* back button */}
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="rounded-2xl flex items-center gap-1 text-sm sm:text-base text-[var(--color-muted-foreground)]"
            >
              <ChevronLeft size={18} />
              Back
            </Button>

            {/* progress indicators */}
            <div className="flex items-center gap-1 sm:gap-2 justify-center flex-1">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentStepIndex
                      ? "w-6 sm:w-8 bg-[var(--color-primary)]"
                      : "w-2 bg-[var(--color-primary-light)]/60"
                  }`}
                  style={{ height: "6px" }}
                />
              ))}
            </div>

            {/* next button */}
            <Button
              onClick={handleNext}
              className="rounded-2xl text-sm sm:text-base px-5"
              style={{
                background: "linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)",
                color: "white",
              }}
            >
              {currentStepIndex === ONBOARDING_STEPS.length - 1
                ? "Build My Flow"
                : "Next"}
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* skip link under progress (mobile only) */}
          <button
            onClick={handleSkip}
            className="sm:hidden text-[13px] opacity-70 hover:opacity-100 transition-opacity text-[var(--color-muted-foreground)]"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* prevent content from being hidden under the fixed nav */}
      <div className="h-20 sm:h-0" />
    </div>
  );
}
