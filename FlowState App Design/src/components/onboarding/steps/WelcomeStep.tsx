import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { Sparkles, Zap, Heart, Shield } from 'lucide-react';

export function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div 
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
            boxShadow: '0 20px 60px rgba(167, 139, 250, 0.3)'
          }}
        >
          <Sparkles size={48} className="text-white" />
        </div>

        <h1 
          className="mb-4"
          style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#6B21A8',
            lineHeight: '1.2'
          }}
        >
          Let's Build Your Perfect Flow
        </h1>

        <p 
          className="opacity-70 max-w-xl mx-auto"
          style={{
            fontSize: '18px',
            lineHeight: '1.6'
          }}
        >
          In the next few steps, we'll customize FlowState to match your needs, energy patterns, and preferences. Your choices will shape your entire experience.
        </p>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        <div 
          className="rounded-3xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.1)'
          }}
        >
          <Zap size={32} className="mx-auto mb-3 text-purple-400" />
          <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: '500' }}>
            Fully Customizable
          </h3>
          <p className="text-sm opacity-60">
            Enable only the features you need, arrange them your way
          </p>
        </div>

        <div 
          className="rounded-3xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.1)'
          }}
        >
          <Heart size={32} className="mx-auto mb-3 text-purple-400" />
          <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: '500' }}>
            Energy-Aware
          </h3>
          <p className="text-sm opacity-60">
            Everything adapts to how you're feeling today
          </p>
        </div>

        <div 
          className="rounded-3xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.1)'
          }}
        >
          <Shield size={32} className="mx-auto mb-3 text-purple-400" />
          <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: '500' }}>
            Your Data, Your Control
          </h3>
          <p className="text-sm opacity-60">
            Everything stays on your device unless you choose to sync
          </p>
        </div>
      </motion.div>

      {/* What We'll Cover */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-3xl p-6 max-w-2xl mx-auto"
        style={{
          background: 'white',
          border: '1px solid rgba(167, 139, 250, 0.1)'
        }}
      >
        <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
          What we'll set up together:
        </h3>
        <div className="space-y-3">
          {[
            'Your preferred coaching tone and theme',
            'Life areas you want to focus on',
            'Features and tools you will use',
            'Your personalized navigation',
            'Dashboard layout and widgets',
            'Journaling and reflection preferences',
            'Notification settings',
            'App integrations',
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#A78BFA' }}
              />
              <span className="opacity-70">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center max-w-xl mx-auto"
      >
        <p className="text-sm opacity-50">
          💜 This should take about 3-5 minutes. You can change any of these settings later in your preferences.
        </p>
      </motion.div>
    </div>
  );
}