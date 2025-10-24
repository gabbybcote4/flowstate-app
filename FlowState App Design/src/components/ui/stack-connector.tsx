// src/components/ui/stack-connector.tsx
// StackConnector Component and Variants for Habit Stacking Visualization
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Link2, Zap } from 'lucide-react';

interface StackConnectorProps {
  /** type of connection */
  type?: 'arrow' | 'chain' | 'flow';
  /** connection label */
  label?: string;
  /** color theme */
  color?: string;
  /** show animation */
  animated?: boolean;
  /** orientation */
  orientation?: 'vertical' | 'horizontal';
  /** size variant */
  size?: 'sm' | 'md' | 'lg';
  /** custom className */
  className?: string;
}

export function StackConnector({
  type = 'arrow',
  label = 'then',
  color = '#8b5cf6',
  animated = true,
  orientation = 'vertical',
  size = 'md',
  className = '',
}: StackConnectorProps) {
  const sizeConfig = {
    sm: { height: 'h-8', width: 'w-8', iconSize: 14, fontSize: 'text-xs' },
    md: { height: 'h-12', width: 'w-12', iconSize: 18, fontSize: 'text-sm' },
    lg: { height: 'h-16', width: 'w-16', iconSize: 24, fontSize: 'text-base' },
  };

  const config = sizeConfig[size];

  const getIcon = () => {
    switch (type) {
      case 'chain':
        return <Link2 size={config.iconSize} />;
      case 'flow':
        return <Zap size={config.iconSize} />;
      default:
        return <ArrowDown size={config.iconSize} />;
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>

        {/* left line */}
        < motion.div
          initial={animated ? { scaleX: 0 } : undefined}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 h-0.5 origin-left"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
        
        {/* icon/Label */}
        < motion.div
          initial={animated ? { scale: 0, rotate: -180 } : undefined}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.3,
          }}
          className={`${config.width} ${config.height} rounded-xl flex items-center justify-center flex-shrink-0`}
          style={{ 
            backgroundColor: `${color}15`,
            color,
          }}
        >
          {label ? (
            <span className={`${config.fontSize} uppercase tracking-wide`}>
              {label}
            </span>
          ) : (
            getIcon()
          )}
        </ motion.div>
        
        {/* right line */}
        < motion.div
          initial={animated ? { scaleX: 0 } : undefined}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 h-0.5 origin-right"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
      </div>
    );
  }

  // vertical orientation
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>

      {/* top line */}
      < motion.div
        initial={animated ? { scaleY: 0 } : undefined}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-0.5 h-4 origin-top"
        style={{ backgroundColor: color, opacity: 0.3 }}
      />
      
      {/* icon/Label */}
      < motion.div
        initial={animated ? { scale: 0, rotate: -180 } : undefined}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.3,
        }}
        className={`${config.width} ${config.height} rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{ 
          backgroundColor: `${color}15`,
          color,
        }}
      >
        {label && type === 'arrow' ? (
          <span className={`${config.fontSize} uppercase tracking-wide`}>
            {label}
          </span>
        ) : (
          getIcon()
        )}
      </motion.div>

      {/* bottom line */}
      <motion.div
        initial={animated ? { scaleY: 0 } : undefined}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-0.5 h-4 origin-bottom"
        style={{ backgroundColor: color, opacity: 0.3 }}
      />
    </div>
  );
}

/**
 * StackConnectorDotted - dotted line variant
 */
interface StackConnectorDottedProps {
  orientation?: 'vertical' | 'horizontal';
  color?: string;
  className?: string;
}

export function StackConnectorDotted({
  orientation = 'vertical',
  color = '#8b5cf6',
  className = '',
}: StackConnectorDottedProps) {
  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-center gap-1 py-2 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: color, opacity: 0.4 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 px-2 ${className}`}>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: color, opacity: 0.4 }}
        />
      ))}
    </div>
  );
}

/**
 * StackConnectorFlow - animated flow connector
 */
interface StackConnectorFlowProps {
  orientation?: 'vertical' | 'horizontal';
  color?: string;
  className?: string;
}

export function StackConnectorFlow({
  orientation = 'vertical',
  color = '#8b5cf6',
  className = '',
}: StackConnectorFlowProps) {
  if (orientation === 'horizontal') {
    return (
      <div className={`relative h-8 flex items-center ${className}`}>
        <div
          className="absolute inset-0 h-0.5 my-auto"
          style={{ backgroundColor: color, opacity: 0.2 }}
        />
        
        {/* flowing particles */}
        {[0, 1, 2].map((i) => (
          < motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ left: '-8px', opacity: 0 }}
            animate={{
              left: 'calc(100% + 8px)',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.7,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`relative w-8 flex justify-center ${className}`}>
      <div
        className="absolute inset-0 w-0.5 mx-auto"
        style={{ backgroundColor: color, opacity: 0.2 }}
      />
      
      {/* flowing particles */}
      {[0, 1, 2].map((i) => (
        < motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ top: '-8px', opacity: 0 }}
          animate={{
            top: 'calc(100% + 8px)',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.7,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/**
 * HabitStackVisualizer - complete habit stack with connectors
 */
interface HabitStackVisualizerProps {
  habits: Array<{
    id: string;
    name: string;
    emoji?: string;
    completed?: boolean;
  }>;
  color?: string;
  className?: string;
}

export function HabitStackVisualizer({
  habits,
  color = '#8b5cf6',
  className = '',
}: HabitStackVisualizerProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {habits.map((habit, index) => (
        <React.Fragment key={habit.id}>

          {/* habit card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-4 rounded-2xl border-2 flex items-center gap-3
              ${habit.completed ? 'bg-green-50 border-green-200' : 'bg-[var(--color-card)] border-gray-200'}
            `}
          >
            {habit.emoji && <span className="text-2xl">{habit.emoji}</span>}
            <span className="flex-1 text-sm">{habit.name}</span>
            {habit.completed && (
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path
                    d="M1 5L4.5 8.5L11 1.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </motion.div>
          
          {/* connector (except after last habit) */}
          {index < habits.length - 1 && (
            <StackConnector
              type="arrow"
              label="then"
              color={color}
              animated={true}
              size="sm"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
