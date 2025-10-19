import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserConfig } from '../../config/UserConfigContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

// Step components
import { WelcomeStep } from './steps/WelcomeStep';
import { ToneStep } from './steps/ToneStep';
import { ThemeStep } from './steps/ThemeStep';
import { LifeAreasStep } from './steps/LifeAreasStep';
import { FeaturesStep } from './steps/FeaturesStep';
import { NavigationStep } from './steps/NavigationStep';
import { DashboardLayoutStep } from './steps/DashboardLayoutStep';
import { WidgetsStep } from './steps/WidgetsStep';
import { JournalingStep } from './steps/JournalingStep';
import { NotificationsStep } from './steps/NotificationsStep';
import { IntegrationsStep } from './steps/IntegrationsStep';
import { ReviewStep } from './steps/ReviewStep';

// Live preview
import { LivePreviewPanel } from './LivePreviewPanel';

export interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', component: WelcomeStep, showPreview: false },
  { id: 'tone', title: 'Your Tone', component: ToneStep, showPreview: true },
  { id: 'theme', title: 'Theme', component: ThemeStep, showPreview: true },
  { id: 'lifeAreas', title: 'Life Areas', component: LifeAreasStep, showPreview: true },
  { id: 'features', title: 'Features', component: FeaturesStep, showPreview: true },
  { id: 'navigation', title: 'Navigation', component: NavigationStep, showPreview: true },
  { id: 'layout', title: 'Dashboard Layout', component: DashboardLayoutStep, showPreview: true },
  { id: 'widgets', title: 'Widgets', component: WidgetsStep, showPreview: true },
  { id: 'journaling', title: 'Journaling', component: JournalingStep, showPreview: false },
  { id: 'notifications', title: 'Notifications', component: NotificationsStep, showPreview: false },
  { id: 'integrations', title: 'Integrations', component: IntegrationsStep, showPreview: false },
  { id: 'review', title: 'Review & Apply', component: ReviewStep, showPreview: false },
];

interface ConfigOnboardingWizardProps {
  onComplete: () => void;
}

export function ConfigOnboardingWizard({ onComplete }: ConfigOnboardingWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { config, updateConfig } = useUserConfig();

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const StepComponent = currentStep.component;
  const showPreview = currentStep.showPreview && currentStepIndex > 0;

  const handleNext = () => {
    if (currentStepIndex === ONBOARDING_STEPS.length - 1) {
      // Complete onboarding
      console.log('🎉 Completing onboarding with config:', config);
      updateConfig({ 
        onboardingCompleted: true,
        onboardingStep: ONBOARDING_STEPS.length 
      });
      console.log('✅ Onboarding marked as complete');
      onComplete();
    } else {
      setDirection(1);
      setCurrentStepIndex(prev => prev + 1);
      updateConfig({ onboardingStep: currentStepIndex + 1 });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
      updateConfig({ onboardingStep: currentStepIndex - 1 });
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-peach-50 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100">
        <motion.div
          className="h-full rounded-r-full"
          style={{ background: 'linear-gradient(90deg, #A78BFA 0%, #C084FC 100%)' }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Step Content */}
        <div className={`flex-1 ${showPreview ? 'lg:w-3/5' : 'w-full'} overflow-y-auto`}>
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Step Counter */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-sm opacity-50">
                Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
              </p>
              <h2 
                className="mt-1"
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#6B21A8'
                }}
              >
                {currentStep.title}
              </h2>
            </motion.div>

            {/* Step Component */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStepIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <StepComponent
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={currentStepIndex === 0}
                  isLast={currentStepIndex === ONBOARDING_STEPS.length - 1}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side - Live Preview (desktop only) */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="hidden lg:flex lg:w-2/5 border-l border-gray-200 bg-white/50 backdrop-blur-sm"
          >
            <LivePreviewPanel />
          </motion.div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="rounded-2xl"
          >
            <ChevronLeft size={20} />
            Back
          </Button>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  scale: currentStepIndex === index ? 1.2 : 1,
                  opacity: currentStepIndex === index ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="rounded-full"
                style={{
                  width: currentStepIndex === index ? '32px' : '8px',
                  height: '8px',
                  backgroundColor: '#A78BFA',
                }}
              />
            ))}
          </div>

          {/* Next/Complete Button */}
          <Button
            onClick={handleNext}
            className="rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
              color: 'white',
            }}
          >
            {currentStepIndex === ONBOARDING_STEPS.length - 1 ? 'Build My Flow' : 'Next'}
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}