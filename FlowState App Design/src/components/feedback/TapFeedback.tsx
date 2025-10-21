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
    <div style={{ position: 'relative' }}>
      <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">
        TAP FEEDBACK
      </div>
      <div
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
      </div>
    </div>
  );
}
