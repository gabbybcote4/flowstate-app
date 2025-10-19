import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeContext';

interface ScreenTransitionLoaderProps {
  isTransitioning: boolean;
}

export function ScreenTransitionLoader({ isTransitioning }: ScreenTransitionLoaderProps) {
  const { themeColors } = useTheme();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
          style={{
            background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.primaryDark})`
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
