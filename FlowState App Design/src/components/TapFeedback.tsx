import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface TapFeedbackProps {
  children: ReactNode;
  scale?: number;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function TapFeedback({ 
  children, 
  scale = 0.95,
  disabled = false,
  className = '',
  onClick
}: TapFeedbackProps) {
  
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileTap={{ scale }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
