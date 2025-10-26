// src/components/onboarding/steps/FeaturesStep.tsx
// onboarding step for selecting features to enable
import { useEffect } from 'react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { FEATURE_REGISTRY, FEATURE_CATEGORIES } from '../../../config/featureRegistry';
import { Switch } from '../../ui/switch';
import { Lock } from 'lucide-react';

export function FeaturesStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  // ensure all core features are always enabled in config
  useEffect(() => {
    const coreKeys = Object.keys(FEATURE_REGISTRY).filter(
      (key) => FEATURE_REGISTRY[key].category === 'core'
    );

    const updated = { ...config.enabledFeatures };
    let changed = false;

    coreKeys.forEach((key) => {
      if (!updated[key]) {
        updated[key] = true;
        changed = true;
      }
    });

    if (changed) {
      updateConfig({ enabledFeatures: updated });
    }
  }, [config.enabledFeatures, updateConfig]);

  const toggleFeature = (featureKey: string) => {
    const feature = FEATURE_REGISTRY[featureKey];
    if (!feature || feature.category === 'core') return;

    updateConfig({
      enabledFeatures: {
        ...config.enabledFeatures,
        [featureKey]: !config.enabledFeatures[featureKey],
      },
    });
  };

  const categories = ['core', 'productivity', 'wellness', 'growth', 'advanced'];

  // compute enabled count directly from config
  const enabledCount = Object.entries(config.enabledFeatures).filter(
    ([key, value]) => value && FEATURE_REGISTRY[key]
  ).length;

  return (
    <div className="space-y-8">

      {/* intro */}
      <p className="opacity-70 mb-4 text-[16px] leading-relaxed">
        Choose which features to enable. Core features are always active and cannot be turned off.
      </p>

      {/* category layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category) => {
          const features = Object.values(FEATURE_REGISTRY).filter(
            (f) => f.category === category
          );

          if (features.length === 0) return null;

          const categoryInfo =
            FEATURE_CATEGORIES[category as keyof typeof FEATURE_CATEGORIES];

          return (
            <div key={category}>

              {/* Category Header */}
              <h3
                className="mb-3 font-semibold text-[16px] flex items-center gap-2"
                style={{
                  color:
                    category === 'core'
                      ? '#6B21A8'
                      : categoryInfo?.color || '#4B5563',
                }}
              >
                {category === 'core' && <Lock size={16} />}
                {category === 'core'
                  ? 'Core Features'
                  : categoryInfo?.label}
              </h3>

              <div className="space-y-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  const isEnabled = config.enabledFeatures[feature.key];
                  const isCore = feature.category === 'core';

                  return (
                    <div
                      key={feature.key}
                      className="rounded-2xl p-2 flex items-center gap-3 transition-all"
                      style={{
                        background: isEnabled
                          ? 'rgba(167, 139, 250, 0.05)'
                          : 'white',
                        border: isEnabled
                          ? '2px solid rgba(167, 139, 250, 0.2)'
                          : '2px solid rgba(0, 0, 0, 0.05)',
                        opacity: isCore ? 0.8 : 1,
                      }}
                    >
                      {/* icon */}
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

                      {/* label + description */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-medium">
                          {feature.label}
                          {isCore && (
                            <span
                              className="ml-2 text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: 'rgba(167, 139, 250, 0.1)',
                                color: '#6B21A8',
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

                      {/* toggle */}
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => toggleFeature(feature.key)}
                        disabled={isCore}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* footer summary */}
      <p className="text-sm opacity-50 text-center mt-6">
        {enabledCount} features enabled
      </p>
    </div>
  );
}
