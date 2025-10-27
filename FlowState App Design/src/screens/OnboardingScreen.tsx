// src/screens/OnboardingScreen.tsx
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthScreen } from "../screens/AuthScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { ConfigOnboardingWizard } from "../components/onboarding/ConfigOnboardingWizard";
import { useNavigation } from "../components/context/NavigationContext";
import { useTheme } from "../components/ThemeContext";
import { Sparkles, Activity, Target, Zap, UserPlus, ChevronRight } from "lucide-react";

// types
interface OnboardingStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  illustration: string;
}

interface OnboardingWrapperProps {
  editMode?: string;
  children?: React.ReactNode;
}

interface OnboardingScreenProps {
  onComplete: () => void;
}

// intro slides
const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    icon: <Sparkles size={48} className="text-[var(--color-primary)]" />,
    title: "Welcome to FlowState",
    description:
      "Your gentle companion for navigating life with fluctuating energy",
    buttonText: "Let’s begin",
    illustration: "✨",
  },
  {
    id: 2,
    icon: <Activity size={48} className="text-[var(--color-primary)]" />,
    title: "Track your energy patterns",
    description:
      "Understand your natural rhythms and work with them, not against them",
    buttonText: "Continue",
    illustration: "🌊",
  },
  {
    id: 3,
    icon: <Target size={48} className="text-[var(--color-primary)]" />,
    title: "Set wellness goals",
    description:
      "Create meaningful goals that adapt to how you’re feeling each day",
    buttonText: "Next",
    illustration: "🎯",
  },
  {
    id: 4,
    icon: <Zap size={48} className="text-[var(--color-primary)]" />,
    title: "Connect your tools",
    description:
      "Sync calendars, habits, and health data for a complete picture",
    buttonText: "Almost there",
    illustration: "🔗",
  },
  {
    id: 5,
    icon: <UserPlus size={48} className="text-[var(--color-primary)]" />,
    title: "You’re all set",
    description:
      "Let’s start building routines that honor your energy, not fight it",
    buttonText: "Get started",
    illustration: "🌱",
  },
];

// main onboarding intro
export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setDirection] = useState(1);
  const { themeColors, darkMode } = useTheme();

  const step = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep === onboardingSteps.length - 1) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-700"
      style={{
        background: darkMode
          ? themeColors.background
          : `linear-gradient(to bottom right, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      {/* skip button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-sm opacity-60 hover:opacity-100 transition-opacity px-4 py-2 text-[var(--color-card-foreground)]"
        >
          Skip
        </button>
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md text-center">

          {/* illustration circle */}
          <div className="mb-8 items-center justify-center flex">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-7xl mx-auto"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
                boxShadow: `0 20px 60px ${themeColors.primaryLight}33`,
              }}
            >
              {step.illustration}
            </div>
          </div>

          <h1 className="mb-4 text-2xl font-semibold text-[var(--color-card-foreground)] capitalize">
            {step.title}
          </h1>

          <p className="mb-12 opacity-80 text-base leading-relaxed text-[var(--color-card-foreground)]">
            {step.description}
          </p>

          <button
            onClick={handleNext}
            className="w-full py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-white font-medium"
            style={{
              background: `linear-gradient(90deg, ${themeColors.primaryLight}, ${themeColors.primaryDark})`,
            }}
          >
            {step.buttonText}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* progress dots */}
      <div className="pb-8 flex items-center justify-center gap-2">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className="rounded-full transition-all"
            style={{
              width: currentStep === index ? "32px" : "8px",
              height: "8px",
              backgroundColor:
                currentStep === index
                  ? themeColors.primary
                  : `${themeColors.primaryLight}`,
              opacity: currentStep === index ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// unified wrapper
export function OnboardingWrapper({ children, editMode }: OnboardingWrapperProps) {
  const { navigate } = useNavigation();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    "flowstate-onboarding-complete",
    false
  );
  const [hasCompletedAuth, setHasCompletedAuth] = useLocalStorage(
    "flowstate-auth-complete",
    false
  );
  const [hasCompletedWelcome, setHasCompletedWelcome] = useLocalStorage(
    "flowstate-welcome-complete",
    false
  );
  const [hasCompletedConfig, setHasCompletedConfig] = useLocalStorage(
    "flowstate-config-complete",
    false
  );
  const [userName] = useLocalStorage("flowstate-user-name", "Friend");

  const handleOnboardingComplete = () => setHasCompletedOnboarding(true);
  const handleAuthComplete = () => setHasCompletedAuth(true);
  const handleWelcomeComplete = () => {
    setHasCompletedWelcome(true);
    navigate("checkin");
  };

  const handleConfigComplete = () => {
    // save completion and navigate
    setHasCompletedConfig(true);
    if (editMode === "layout") {
      navigate("settings");
    } else {
      navigate("home");
    }
  };

  // layout edit mode
  if (editMode === "layout") {
    return (
      <ConfigOnboardingWizard
        onComplete={handleConfigComplete}
        editMode="layout"
      />
    );
  }

  // onboarding flow
  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (!hasCompletedAuth) {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  if (!hasCompletedWelcome) {
    return (
      <WelcomeScreen
        userName={userName}
        onStartCheckIn={handleWelcomeComplete}
      />
    );
  }

  if (!hasCompletedConfig) {
    return <ConfigOnboardingWizard onComplete={handleConfigComplete} />;
  }

  // main app after all onboarding steps
  return <>{children}</>;
}
