import React from 'react';
import { motion } from 'motion/react';

/**
 * MomentumRing Component
 * 
 * Circular progress indicator for daily momentum tracking
 * Shows completion percentage with animated ring
 */

interface MomentumRingProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Size of the ring in pixels */
  size?: number;
  /** Stroke width of the ring */
  strokeWidth?: number;
  /** Color of the progress ring */
  color?: string;
  /** Background ring color */
  backgroundColor?: string;
  /** Optional label in center */
  label?: string;
  /** Optional value display */
  value?: string | number;
  /** Show percentage */
  showPercentage?: boolean;
  /** Animate on mount */
  animate?: boolean;
  /** Custom className */
  className?: string;
}

export function MomentumRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#8b5cf6',
  backgroundColor = '#e5e7eb',
  label,
  value,
  showPercentage = true,
  animate = true,
  className = '',
}: MomentumRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ 
            duration: animate ? 1.5 : 0,
            ease: [0.4, 0, 0.2, 1],
            delay: animate ? 0.2 : 0,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value && (
          <motion.span
            initial={animate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animate ? 0.5 : 0, duration: 0.4 }}
            className="text-2xl text-gray-900 tabular-nums"
          >
            {value}
          </motion.span>
        )}
        
        {showPercentage && !value && (
          <motion.span
            initial={animate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animate ? 0.5 : 0, duration: 0.4 }}
            className="text-2xl text-gray-900 tabular-nums"
          >
            {Math.round(progress)}%
          </motion.span>
        )}
        
        {label && (
          <motion.span
            initial={animate ? { opacity: 0 } : { opacity: 0.6 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: animate ? 0.6 : 0, duration: 0.4 }}
            className="text-xs text-gray-600 mt-1"
          >
            {label}
          </motion.span>
        )}
      </div>
    </div>
  );
}

/**
 * MomentumRingMini - Smaller variant for inline use
 */
interface MomentumRingMiniProps {
  progress: number;
  size?: number;
  color?: string;
  className?: string;
}

export function MomentumRingMini({
  progress,
  size = 24,
  color = '#8b5cf6',
  className = '',
}: MomentumRingMiniProps) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={`transform -rotate-90 ${className}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}
