import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export function FadeInView({ 
  children, 
  delay = 0, 
  direction = 'up',
  duration = 0.5,
  className = ''
}: FadeInViewProps) {
  
  const directionVariants = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {}
  };

  return (
    < div
      initial={{ 
        opacity: 0,
        ...directionVariants[direction]
      }}
      animate={{ 
        opacity: 1,
        y: 0,
        x: 0
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </ div>
  );
}
