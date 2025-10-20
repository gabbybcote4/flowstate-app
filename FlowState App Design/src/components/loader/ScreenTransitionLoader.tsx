//  from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface ScreenTransitionLoaderProps {
  isTransitioning: boolean;
}

export function ScreenTransitionLoader({  }: ScreenTransitionLoaderProps) {
  const { themeColors } = useTheme();

  return (
        < div

          className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
          style={{
            background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.primaryDark})`
          }}
        >
          {/* Shimmer effect */}
          < div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"

          />
        </ div>
  );
}
