// src/components/PageLoadingState.tsx
// A full-page loading state component with animated spinner and text
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { Loader2 } from 'lucide-react';

export function PageLoadingState() {
  const { themeColors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center flow-card"
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Loader2 
            size={32} 
            style={{ color: themeColors.primary }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm opacity-60"
        >
          Loading...
        </motion.div>
      </ motion.div>
    </ motion.div>
  );
}
