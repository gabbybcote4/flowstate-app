import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { FEATURE_REGISTRY } from '../../../config/featureRegistry';
import { Sparkles, Check, Edit } from 'lucide-react';
import { Button } from '../../ui/button';

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
      {/* Hero */}
      < div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div 
          className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
            boxShadow: '0 20px 60px rgba(167, 139, 250, 0.3)'
          }}
        >
          <Sparkles size={40} className="text-white" />
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

      {/* Phone Mock Preview */}
      < div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-sm mx-auto"
      >
        <div 
          className="rounded-[48px] p-3 shadow-2xl"
          style={{
            background: config.theme.mode === 'dark' 
              ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
              : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
            border: '8px solid #1F2937',
          }}
        >
          <div 
            className="h-96 rounded-[40px] overflow-hidden p-4"
            style={{
              background: config.theme.mode === 'dark' ? '#111827' : '#FFFFFF',
            }}
          >
            <p className="text-xs opacity-60 mb-3">Your FlowState</p>
            <div className="space-y-2">
              {config.dashboardLayout.slice(0, 3).map((widget, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-3"
                  style={{
                    background: config.theme.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(167, 139, 250, 0.05)',
                    height: widget.size === 'L' ? '100px' : widget.size === 'M' ? '60px' : '40px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </ div>

      {/* Summary Grid */}
      < div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Features */}
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
                style={{ background: 'rgba(167, 139, 250, 0.1)' }}
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

        {/* Widgets */}
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
                style={{ background: 'rgba(167, 139, 250, 0.1)' }}
              >
                {widget}
              </span>
            ))}
          </div>
        </div>

        {/* Theme */}
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

        {/* Notifications */}
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

      {/* Edit Button */}
      < div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-2xl"
        >
          <Edit size={16} />
          Edit Choices
        </Button>
        <p className="text-sm opacity-50 mt-4">
          You can customize everything later in Settings
        </p>
      </ div>
    </div>
  );
}