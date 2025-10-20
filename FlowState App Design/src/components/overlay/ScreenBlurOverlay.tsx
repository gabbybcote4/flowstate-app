//  from 'motion/react';
import { useEffect, useState } from 'react';

interface ScreenBlurOverlayProps {
  isTransitioning: boolean;
}

export function ScreenBlurOverlay({ isTransitioning }: ScreenBlurOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setShow(true);
    } else {
      // Delay hiding to allow transition to complete
      const timer = setTimeout(() => setShow(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <AnimatePresence>
      {show && (
        < div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.2,
            ease: 'easeInOut'
          }}
          className="fixed inset-0 pointer-events-none z-30"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.3)'
          }}
        />
      )}
    </AnimatePresence>
  );
}
