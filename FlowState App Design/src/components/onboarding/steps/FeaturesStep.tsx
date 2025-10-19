import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { FEATURE_REGISTRY, FEATURE_CATEGORIES } from '../../../config/featureRegistry';
import { Switch } from '../../ui/switch';

export function FeaturesStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const toggleFeature = (featureKey: string) => {
    // Don't allow disabling core features
    if (FEATURE_REGISTRY[featureKey]?.category === 'core') return;
    
    updateConfig({
      enabledFeatures: {
        ...config.enabledFeatures,
        [featureKey]: !config.enabledFeatures[featureKey],
      },
    });
  };

  const categories = ['productivity', 'wellness', 'growth', 'advanced'];

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Choose which features to enable. You can always add more later. Core features are always enabled.
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category, catIndex) => {
          const features = Object.values(FEATURE_REGISTRY).filter(
            f => f.category === category
          );
          
          if (features.length === 0) return null;

          return (
            < div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h3 
                className="mb-3"
                style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  color: FEATURE_CATEGORIES[category as keyof typeof FEATURE_CATEGORIES]?.color 
                }}
              >
                {FEATURE_CATEGORIES[category as keyof typeof FEATURE_CATEGORIES]?.label}
              </h3>

              <div className="space-y-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isEnabled = config.enabledFeatures[feature.key];
                  const isCore = feature.category === 'core';

                  return (
                    < div
                      key={feature.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                      className="rounded-2xl p-4 flex items-center gap-4 transition-all"
                      style={{
                        background: isEnabled ? 'rgba(167, 139, 250, 0.05)' : 'white',
                        border: isEnabled
                          ? '2px solid rgba(167, 139, 250, 0.2)'
                          : '2px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isEnabled
                            ? 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)'
                            : 'rgba(167, 139, 250, 0.1)',
                        }}
                      >
                        <Icon 
                          size={20} 
                          style={{ color: isEnabled ? 'white' : '#A78BFA' }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 style={{ fontSize: '15px', fontWeight: '500' }}>
                          {feature.label}
                          {isCore && (
                            <span 
                              className="ml-2 text-xs px-2 py-0.5 rounded-full"
                              style={{ 
                                background: 'rgba(167, 139, 250, 0.1)',
                                color: '#6B21A8'
                              }}
                            >
                              Core
                            </span>
                          )}
                        </h4>
                        <p className="text-sm opacity-60 mt-0.5">
                          {feature.description}
                        </p>
                      </div>

                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => toggleFeature(feature.key)}
                        disabled={isCore}
                      />
                    </ div>
                  );
                })}
              </div>
            </ div>
          );
        })}
      </div>

      <p className="text-sm opacity-50 text-center">
        {Object.values(config.enabledFeatures).filter(Boolean).length} features enabled
      </p>
    </div>
  );
}
