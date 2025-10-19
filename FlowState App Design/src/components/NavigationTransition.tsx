import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface NavigationTransitionProps {
  children: ReactNode;
  screenKey: string;
  direction?: 'up' | 'down' | 'fade';
}

export function NavigationTransition({ 
  children, 
  screenKey,
  direction = 'up' 
}: NavigationTransitionProps) {
  
  const variants = {
    up: {
      initial: { 
        opacity: 0, 
        y: 20,
        scale: 0.98
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
          opacity: { duration: 0.3 },
          y: { duration: 0.4 },
          scale: { duration: 0.4 }
        }
      },
      exit: { 
        opacity: 0,
        y: -10,
        scale: 0.98,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    down: {
      initial: { 
        opacity: 0, 
        y: -20,
        scale: 0.98
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.3 }
        }
      },
      exit: { 
        opacity: 0,
        y: 10,
        scale: 0.98,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    fade: {
      initial: { 
        opacity: 0,
        scale: 0.99
      },
      animate: { 
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      exit: { 
        opacity: 0,
        scale: 0.99,
        transition: {
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={variants[direction]}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
