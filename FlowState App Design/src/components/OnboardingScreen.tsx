import { useState } from 'react';
import { Button } from './ui/button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';
import { AuthScreen } from './AuthScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { ConfigOnboardingWizard } from './onboarding/ConfigOnboardingWizard';
import { useNavigation } from './NavigationContext';
import { useUserConfig } from '../config/UserConfigContext';
import { 
  Sparkles, 
  Activity, 
  Target, 
  Zap, 
  UserPlus,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  illustration: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    icon: <Sparkles size={48} className="text-purple-300" />,
    title: "Welcome to FlowState",
    description: "Your compassionate companion for navigating life with fluctuating energy",
    buttonText: "Let's Begin",
    illustration: "✨"
  },
  {
    id: 2,
    icon: <Activity size={48} className="text-purple-300" />,
    title: "Track Your Energy Patterns",
    description: "Understand your unique rhythms and work with them, not against them",
    buttonText: "Continue",
    illustration: "🌊"
  },
  {
    id: 3,
    icon: <Target size={48} className="text-purple-300" />,
    title: "Set Wellness Goals",
    description: "Create meaningful goals that adapt to how you're feeling each day",
    buttonText: "Next",
    illustration: "🎯"
  },
  {
    id: 4,
    icon: <Zap size={48} className="text-purple-300" />,
    title: "Connect Your Tools",
    description: "Sync calendars, habits, and health data for a complete picture",
    buttonText: "Almost There",
    illustration: "🔗"
  },
  {
    id: 5,
    icon: <UserPlus size={48} className="text-purple-300" />,
    title: "You're All Set!",
    description: "Let's start building sustainable routines that honor your energy",
    buttonText: "Get Started",
    illustration: "🌱"
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (currentStep === onboardingSteps.length - 1) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = onboardingSteps[currentStep];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-peach-50 flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-sm opacity-50 hover:opacity-100 transition-opacity px-4 py-2"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="flex flex-col items-center text-center"
            >
              {/* Illustration */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-7xl"
                  style={{
                    background: 'linear-gradient(135deg, #E9D5FF 0%, #FED7AA 100%)',
                    boxShadow: '0 20px 60px rgba(167, 139, 250, 0.15)'
                  }}
                >
                  {step.illustration}
                </div>
              </motion.div>

              {/* Icon */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                {step.icon}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
                style={{
                  color: '#6B21A8',
                  fontSize: '28px',
                  fontWeight: '600',
                  lineHeight: '1.2'
                }}
              >
                {step.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-12 opacity-70 max-w-sm"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}
              >
                {step.description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <button
                  onClick={handleNext}
                  className="w-full py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  {step.buttonText}
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="pb-8 flex items-center justify-center gap-2">
        {onboardingSteps.map((_, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              scale: currentStep === index ? 1.2 : 1,
              opacity: currentStep === index ? 1 : 0.3
            }}
            transition={{ duration: 0.3 }}
            className="rounded-full transition-all"
            style={{
              width: currentStep === index ? '32px' : '8px',
              height: '8px',
              backgroundColor: '#A78BFA'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Wrapper component to handle onboarding completion state
export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { navigate } = useNavigation();
  const { config } = useUserConfig();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    'flowstate-onboarding-complete',
    false
  );
  const [hasCompletedAuth, setHasCompletedAuth] = useLocalStorage(
    'flowstate-auth-complete',
    false
  );
  const [hasCompletedWelcome, setHasCompletedWelcome] = useLocalStorage(
    'flowstate-welcome-complete',
    false
  );
  const [userName, setUserName] = useLocalStorage('flowstate-user-name', 'Friend');

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  const handleAuthComplete = () => {
    setHasCompletedAuth(true);
    // TODO: Get user name from auth and store it
    // For now, using default
  };

  const handleWelcomeComplete = () => {
    setHasCompletedWelcome(true);
    // Navigate to check-in screen
    navigate('checkin');
  };

  const handleConfigComplete = () => {
    // Config wizard will update config.onboardingCompleted
    // Just navigate to home
    navigate('home');
  };

  // Show onboarding first
  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Then show auth
  if (!hasCompletedAuth) {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  // Then show welcome screen
  if (!hasCompletedWelcome) {
    return <WelcomeScreen userName={userName} onStartCheckIn={handleWelcomeComplete} />;
  }

  // Then show config wizard (12-step onboarding)
  if (!config.onboardingCompleted) {
    return <ConfigOnboardingWizard onComplete={handleConfigComplete} />;
  }

  // Finally show the main app
  return <>{children}</>;
}