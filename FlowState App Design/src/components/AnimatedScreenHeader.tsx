import { motion } from '../lib/motion-shim';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface AnimatedScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function AnimatedScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction
}: AnimatedScreenHeaderProps) {
  const { themeColors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4"
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          {onBack && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              style={{ color: themeColors.primary }}
            >
              <ArrowLeft size={22} />
            </motion.button>
          )}

          {/* Title Section */}
          <div className={onBack ? 'flex-1 px-4' : 'flex-1'}>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-xl"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="text-sm opacity-60 mt-0.5"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Right Action */}
          {rightAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {rightAction}
            </motion.div>
          )}
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`
        }}
      />
    </motion.div>
  );
}
