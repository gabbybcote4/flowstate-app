// src/components/ui/correlation-card.tsx
// CorrelationCard Component for displaying habit and mood correlations
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Info } from 'lucide-react';

interface CorrelationCardProps {
  /** source element (what influences) */
  from: {
    label: string;
    icon?: React.ReactNode;
    emoji?: string;
  };
  /** target element (what is influenced) */
  to: {
    label: string;
    icon?: React.ReactNode;
    emoji?: string;
  };
  /** correlation strength (0-100) */
  strength: number;
  /** correlation direction */
  direction: 'positive' | 'negative' | 'neutral';
  /** descriptive insight text */
  insight: string;
  /** optional additional context */
  context?: string;
  /** data points used for correlation */
  dataPoints?: number;
  /** click handler */
  onClick?: () => void;
  /** custom className */
  className?: string;
}

export function CorrelationCard({
  from,
  to,
  strength,
  direction,
  insight,
  context,
  dataPoints,
  onClick,
  className = '',
}: CorrelationCardProps) {
  const getDirectionColor = () => {
    switch (direction) {
      case 'positive':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: 'text-green-600',
          accent: '#10b981',
        };
      case 'negative':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'text-red-600',
          accent: '#ef4444',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-[var(--color-card-foreground)]',
          icon: 'text-gray-600',
          accent: '#6b7280',
        };
    }
  };

  const colors = getDirectionColor();
  const strengthPercentage = Math.round(strength);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        ${colors.bg} ${colors.border} rounded-2xl border-2 p-5 transition-all
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `}
    >
      {/* correlation flow */}
      <div className="flex items-center justify-between mb-4">

        {/* from */}
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-xl flow-card">
            {from.icon || <span className="text-xl">{from.emoji}</span>}
          </div>
          <span className={`text-sm ${colors.text}`}>{from.label}</span>
        </div>

        {/* arrow */}
        <div className="flex flex-col items-center gap-1 px-3">
          <ArrowRight size={20} className={colors.icon} />
          <span className={`text-xs ${colors.text} opacity-70`}>
            {strengthPercentage}%
          </span>
        </div>

        {/* to */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className={`text-sm ${colors.text} text-right`}>{to.label}</span>
          <div className="w-10 h-10 rounded-xl flow-card">
            {to.icon || <span className="text-xl">{to.emoji}</span>}
          </div>
        </div>
      </div>

      {/* strength bar */}
      <div className="mb-3">
        <div className="h-2 flow-card">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strengthPercentage}%` }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
      </div>

      {/* insight text */}
      <div className="mb-3">
        <div className="flex items-start gap-2">
          {direction === 'positive' ? (
            <TrendingUp size={16} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
          ) : direction === 'negative' ? (
            <TrendingDown size={16} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
          ) : (
            <Info size={16} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
          )}
          <p className={`text-sm ${colors.text} leading-relaxed`}>
            {insight}
          </p>
        </div>
      </div>

      {/* context */}
      {context && (
        <p className={`text-xs ${colors.text} opacity-70 mb-2`}>
          {context}
        </p>
      )}

      {/* data points */}
      {dataPoints && (
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />
          <span className={`text-xs ${colors.text} opacity-60`}>
            Based on {dataPoints} data point{dataPoints !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * CorrelationCardCompact - smaller variant for lists
 */
interface CorrelationCardCompactProps {
  from: string;
  to: string;
  strength: number;
  direction: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function CorrelationCardCompact({
  from,
  to,
  strength,
  direction,
  className = '',
}: CorrelationCardCompactProps) {
  const getDirectionIcon = () => {
    switch (direction) {
      case 'positive':
        return <TrendingUp size={14} className="text-green-600" />;
      case 'negative':
        return <TrendingDown size={14} className="text-red-600" />;
      default:
        return <ArrowRight size={14} className="text-gray-600" />;
    }
  };

  const getDirectionColor = () => {
    switch (direction) {
      case 'positive':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'negative':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-[var(--color-card-foreground)]';
    }
  };

  return (
    <div className={`${getDirectionColor()} rounded-xl border p-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm flex-1">{from}</span>
        <div className="flex items-center gap-1">
          {getDirectionIcon()}
          <span className="text-xs opacity-70">{Math.round(strength)}%</span>
        </div>
        <span className="text-sm flex-1 text-right">{to}</span>
      </div>
    </div>
  );
}

/**
 * CorrelationInsightsList - group of correlation cards
 */
interface CorrelationInsightsListProps {
  insights: Array<{
    id: string;
    from: { label: string; emoji?: string };
    to: { label: string; emoji?: string };
    strength: number;
    direction: 'positive' | 'negative' | 'neutral';
    insight: string;
    context?: string;
    dataPoints?: number;
  }>;
  onInsightClick?: (id: string) => void;
  className?: string;
}

export function CorrelationInsightsList({
  insights,
  onInsightClick,
  className = '',
}: CorrelationInsightsListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {insights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CorrelationCard
            {...insight}
            onClick={onInsightClick ? () => onInsightClick(insight.id) : undefined}
          />
        </motion.div>
      ))}
    </div>
  );
}
