// src/components/ui/life-area-chip.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type LifeArea = 'health' | 'work' | 'social' | 'personal' | 'creative' | 'learning';

interface LifeAreaChipProps {
  /** life area type */
  area: LifeArea;
  /** custom label (defaults to capitalized area name) */
  label?: string;
  /** selected/active state */
  selected?: boolean;
  /** show close button */
  removable?: boolean;
  /** size variant */
  size?: 'sm' | 'md' | 'lg';
  /** click handler */
  onClick?: () => void;
  /** remove handler */
  onRemove?: () => void;
  /** custom className */
  className?: string;
  /** icon component */
  icon?: React.ReactNode;
}

const lifeAreaConfig: Record<LifeArea, { bg: string; border: string; text: string; label: string; emoji: string }> = {
  health: {
    bg: 'var(--life-health-bg)',
    border: 'var(--life-health-border)',
    text: 'var(--life-health-text)',
    label: 'Health',
    emoji: '💪',
  },
  work: {
    bg: 'var(--life-work-bg)',
    border: 'var(--life-work-border)',
    text: 'var(--life-work-text)',
    label: 'Work',
    emoji: '💼',
  },
  social: {
    bg: 'var(--life-social-bg)',
    border: 'var(--life-social-border)',
    text: 'var(--life-social-text)',
    label: 'Social',
    emoji: '👥',
  },
  personal: {
    bg: 'var(--life-personal-bg)',
    border: 'var(--life-personal-border)',
    text: 'var(--life-personal-text)',
    label: 'Personal',
    emoji: '✨',
  },
  creative: {
    bg: 'var(--life-creative-bg)',
    border: 'var(--life-creative-border)',
    text: 'var(--life-creative-text)',
    label: 'Creative',
    emoji: '🎨',
  },
  learning: {
    bg: 'var(--life-learning-bg)',
    border: 'var(--life-learning-border)',
    text: 'var(--life-learning-text)',
    label: 'Learning',
    emoji: '📚',
  },
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
};

export function LifeAreaChip({
  area,
  label,
  selected = false,
  removable = false,
  size = 'md',
  onClick,
  onRemove,
  className = '',
  icon,
}: LifeAreaChipProps) {
  const config = lifeAreaConfig[area];
  const displayLabel = label || config.label;

  return (
    < motion.button
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full border-2 transition-all
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
        ${selected ? 'shadow-md' : ''}
        ${className}
      `}
      style={{
        backgroundColor: config.bg,
        borderColor: selected ? config.border : 'transparent',
        color: config.text,
      }}
    >
      {/* icon or emoji */}
      {icon || (
        <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
          {config.emoji}
        </span>
      )}
      
      {/* label */}
      <span className="leading-none">
        {displayLabel}
      </span>
      
      {/* remove button */}
      {removable && onRemove && (
        < motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`
            ml-1 rounded-full transition-colors
            ${size === 'sm' ? 'p-0.5' : 'p-1'}
          `}
          style={{
            color: config.text,
            opacity: 0.6,
          }}
        >
          <X size={size === 'sm' ? 10 : 12} />
        </ motion.button>
      )}
    </ motion.button>
  );
}

/**
 * LifeAreaChipGroup - group of life area chips
 */
interface LifeAreaChipGroupProps {
  /** selected life areas */
  selected: LifeArea[];
  /** available life areas (defaults to all) */
  available?: LifeArea[];
  /** multi-select mode */
  multiSelect?: boolean;
  /** change handler */
  onChange?: (selected: LifeArea[]) => void;
  /** size variant */
  size?: 'sm' | 'md' | 'lg';
  /** wrap chips */
  wrap?: boolean;
  /** custom className */
  className?: string;
}

export function LifeAreaChipGroup({
  selected,
  available = ['health', 'work', 'social', 'personal', 'creative', 'learning'],
  multiSelect = true,
  onChange,
  size = 'md',
  wrap = true,
  className = '',
}: LifeAreaChipGroupProps) {
  const handleChipClick = (area: LifeArea) => {
    if (!onChange) return;

    if (multiSelect) {
      // toggle selection
      const newSelected = selected.includes(area)
        ? selected.filter(a => a !== area)
        : [...selected, area];
      onChange(newSelected);
    } else {
      // single select
      onChange([area]);
    }
  };

  return (
    <div className={`flex ${wrap ? 'flex-wrap' : ''} gap-2 ${className}`}>
      {available.map((area) => (
        <LifeAreaChip
          key={area}
          area={area}
          selected={selected.includes(area)}
          size={size}
          onClick={() => handleChipClick(area)}
        />
      ))}
    </div>
  );
}

/**
 * LifeAreaBadge - compact badge variant for inline use
 */
interface LifeAreaBadgeProps {
  area: LifeArea;
  showLabel?: boolean;
  className?: string;
}

export function LifeAreaBadge({ 
  area, 
  showLabel = false,
  className = '' 
}: LifeAreaBadgeProps) {
  const config = lifeAreaConfig[area];

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      <span className="text-xs">{config.emoji}</span>
      {showLabel && (
        <span className="text-xs leading-none">{config.label}</span>
      )}
    </div>
  );
}
