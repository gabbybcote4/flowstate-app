import { motion } from '../lib/motion-shim';
import { useTheme } from './ThemeContext';

export const LIFE_AREAS = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'Health', label: 'Health', emoji: '❤️' },
  { id: 'Work', label: 'Work', emoji: '💼' },
  { id: 'Self-Care', label: 'Self-Care', emoji: '🧘' },
  { id: 'Relationships', label: 'Relationships', emoji: '💕' },
  { id: 'Personal Growth', label: 'Growth', emoji: '🌱' },
  { id: 'Home', label: 'Environment', emoji: '🏡' },
  { id: 'Creativity', label: 'Creativity', emoji: '🎨' },
  { id: 'Finances', label: 'Finances', emoji: '💰' },
];

interface LifeAreaFilterChipsProps {
  selectedArea: string;
  onSelectArea: (areaId: string) => void;
}

export function LifeAreaFilterChips({ selectedArea, onSelectArea }: LifeAreaFilterChipsProps) {
  const { themeColors } = useTheme();

  return (
    <div className="mb-6">
      <h3 className="text-sm opacity-60 mb-3">Filter by life area</h3>
      <div className="flex flex-wrap gap-2">
        {LIFE_AREAS.map((area, index) => {
          const isSelected = selectedArea === area.id;
          
          return (
            <motion.button
              key={area.id}
              onClick={() => onSelectArea(area.id)}
              className="px-4 py-2.5 rounded-full text-sm transition-all relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileTap={{ scale: 0.95 }}
              style={isSelected ? {
                backgroundColor: themeColors.primary,
                color: 'white',
                boxShadow: `0 4px 12px -2px ${themeColors.primary}40`
              } : {
                backgroundColor: 'white',
                color: '#6B7280',
                border: '1px solid #E5E7EB'
              }}
            >
              {/* Hover background */}
              {!isSelected && (
                <motion.div
                  className="absolute inset-0"
                  style={{ backgroundColor: themeColors.gradientTo }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{area.emoji}</span>
                <span>{area.label}</span>
              </span>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selectedAreaIndicator"
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    backgroundColor: themeColors.primary,
                    zIndex: -1
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
