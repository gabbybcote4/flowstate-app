// src/components/onboarding/steps/NavigationStep.tsx
// Component for reordering navigation items during onboarding
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { FEATURE_REGISTRY } from '../../../config/featureRegistry';
import { GripVertical } from 'lucide-react';

export function NavigationStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // get enabled features for navigation
  const enabledNavItems = config.navOrder.filter(
    key => config.enabledFeatures[key] && FEATURE_REGISTRY[key]
  );

  const handleDragStart = (key: string) => {
    setDraggedItem(key);
  };

  const handleDragOver = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetKey) return;

    const newOrder = [...enabledNavItems];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetKey);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    // update full navOrder preserving disabled items
    const fullOrder = config.navOrder.map(key =>
      newOrder.includes(key) ? null : key
    ).filter((k): k is string => k !== null);
    
    newOrder.forEach((key, index) => {
      if (!fullOrder.includes(key)) {
        fullOrder.splice(index, 0, key);
      }
    });

    updateConfig({ navOrder: [...new Set([...newOrder, ...fullOrder])] });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Arrange your navigation in the order you prefer. Drag to reorder. The first 5 will appear in your bottom navigation.
        </p>
      </div>

      <div className="space-y-2">
        {enabledNavItems.map((key, index) => {
          const feature = FEATURE_REGISTRY[key];
          if (!feature) return null;

          const Icon = feature.icon;
          const isBottomNav = index < 5;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              draggable
              onDragStart={() => handleDragStart(key)}
              onDragOver={(e) => handleDragOver(e, key)}
              onDragEnd={handleDragEnd}
              className="rounded-2xl p-4 flex items-center gap-4 cursor-move transition-all"
              style={{
                background: isBottomNav
                  ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)'
                  : 'white',
                border: isBottomNav
                  ? '2px solid rgba(167, 139, 250, 0.3)'
                  : '2px solid rgba(0, 0, 0, 0.05)',
                opacity: draggedItem === key ? 0.5 : 1,
              }}
            >
              <GripVertical size={20} className="opacity-30" />
              
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: isBottomNav
                    ? 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)'
                    : 'rgba(167, 139, 250, 0.1)',
                }}
              >
                <Icon 
                  size={20} 
                  style={{ color: isBottomNav ? 'white' : '#A78BFA' }}
                />
              </div>

              <div className="flex-1">
                <h4 style={{ fontSize: '15px', fontWeight: '500' }}>
                  {feature.label}
                </h4>
                <p className="text-sm opacity-60">Position {index + 1}</p>
              </div>

              {isBottomNav && (
                <span 
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
                    color: 'white',
                  }}
                >
                  Bottom Nav
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm opacity-50 text-center">
        Drag items to reorder • First 5 appear in bottom navigation
      </p>
    </div>
  );
}