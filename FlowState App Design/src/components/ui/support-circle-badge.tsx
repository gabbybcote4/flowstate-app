// src/components/ui/support-circle-badge.tsx
// Badge for displaying support circle members, accountability partners,
// or social support elements in the FlowState app
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, MessageCircle, Sparkles } from 'lucide-react'

interface SupportCircleBadgeProps {
  /** member/supporter info */
  name: string;
  /** avatar URL or emoji */
  avatar?: string;
  /** role/relationship */
  role?: string;
  /** support type */
  type?: 'accountability' | 'encouragement' | 'community' | 'mentor';
  /** online/active status */
  active?: boolean;
  /** size variant */
  size?: 'sm' | 'md' | 'lg';
  /** click handler */
  onClick?: () => void;
  /** custom className */
  className?: string;
}

const typeConfig = {
  accountability: {
    icon: Users,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    label: 'Accountability Partner',
  },
  encouragement: {
    icon: Heart,
    color: '#ec4899',
    bg: '#fdf2f8',
    label: 'Supporter',
  },
  community: {
    icon: MessageCircle,
    color: '#3b82f6',
    bg: '#eff6ff',
    label: 'Community',
  },
  mentor: {
    icon: Sparkles,
    color: '#f59e0b',
    bg: '#fffbeb',
    label: 'Mentor',
  },
};

const sizeConfig = {
  sm: {
    avatar: 'w-8 h-8',
    text: 'text-xs',
    iconSize: 12,
    padding: 'p-2',
  },
  md: {
    avatar: 'w-10 h-10',
    text: 'text-sm',
    iconSize: 14,
    padding: 'p-3',
  },
  lg: {
    avatar: 'w-12 h-12',
    text: 'text-base',
    iconSize: 16,
    padding: 'p-4',
  },
};

export function SupportCircleBadge({
  name,
  avatar,
  role,
  type = 'accountability',
  active = false,
  size = 'md',
  onClick,
  className = '',
}: SupportCircleBadgeProps) {
  const config = typeConfig[type];
  const sizes = sizeConfig[size];
  const IconComponent = config.icon;

  // check if avatar is emoji (single character or emoji)
  const isEmoji = avatar && avatar.length <= 2;

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-2xl border-2 transition-all
        ${sizes.padding}
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `}
      style={{
        backgroundColor: config.bg,
        borderColor: active ? config.color : 'transparent',
      }}
    >
      {/* avatar */}
      <div className="relative">
        <div
          className={`${sizes.avatar} rounded-full flex items-center justify-center overflow-hidden bg-[var(--color-card)]`}
          style={{
            borderWidth: active ? '2px' : '0',
            borderColor: config.color,
          }}
        >
          {isEmoji ? (
            <span className={size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'}>
              {avatar}
            </span>
          ) : avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: config.color, color: 'white' }}
            >
              <span className={sizes.text}>
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* active indicator */}
        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              absolute -bottom-0.5 -right-0.5 rounded-full bg-green-500 border-2 border-white
              ${size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}
            `}
          />
        )}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className={`${sizes.text} truncate`} style={{ color: config.color }}>
          {name}
        </p>
        {role && (
          <p className={`text-xs text-gray-600 truncate`}>
            {role}
          </p>
        )}
      </div>

      {/* type icon */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <IconComponent size={sizes.iconSize} style={{ color: config.color }} />
      </div>
    </ motion.div>
  );
}

/**
 * SupportCircleAvatar - minimal avatar-only variant
 */
interface SupportCircleAvatarProps {
  name: string;
  avatar?: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export function SupportCircleAvatar({
  name,
  avatar,
  active = false,
  size = 'md',
  onClick,
  className = '',
}: SupportCircleAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const isEmoji = avatar && avatar.length <= 2;

  return (
    < motion.div
      whileHover={onClick ? { scale: 1.1 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden
          bg-gradient-to-br from-lavender-400 to-peach-400
          ${active ? 'ring-2 ring-lavender-400 ring-offset-2' : ''}
        `}
      >
        {isEmoji ? (
          <span className={size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'}>
            {avatar}
          </span>
        ) : avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-sm">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {active && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
      )}
    </ motion.div>
  );
}

/**
 * SupportCircleGroup - group of support circle avatars
 */
interface SupportCircleGroupProps {
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
    active?: boolean;
  }>;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  onMemberClick?: (id: string) => void;
  className?: string;
}

export function SupportCircleGroup({
  members,
  maxDisplay = 5,
  size = 'md',
  onMemberClick,
  className = '',
}: SupportCircleGroupProps) {
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  return (
    <div className={`flex items-center ${className}`}>
      {displayMembers.map((member, index) => (
        <div
          key={member.id}
          style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: displayMembers.length - index }}
        >
          <SupportCircleAvatar
            name={member.name}
            avatar={member.avatar}
            active={member.active}
            size={size}
            onClick={onMemberClick ? () => onMemberClick(member.id) : undefined}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={`
            ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}
            rounded-full bg-gray-200 flex items-center justify-center
            text-xs text-gray-600
          `}
          style={{ marginLeft: '-8px', zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

/**
 * SupportCircleStats - display support circle statistics
 */
interface SupportCircleStatsProps {
  totalMembers: number;
  activeMembers: number;
  encouragementCount?: number;
  className?: string;
}

export function SupportCircleStats({
  totalMembers,
  activeMembers,
  encouragementCount,
  className = '',
}: SupportCircleStatsProps) {
  return (
    <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Users size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm text-purple-900">Support Circle</h3>
          <p className="text-xs text-purple-600">{activeMembers} active now</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--color-card)]/60 rounded-xl p-3">
          <p className="text-2xl text-purple-900">{totalMembers}</p>
          <p className="text-xs text-purple-600">Members</p>
        </div>
        
        {encouragementCount !== undefined && (
          <div className="bg-[var(--color-card)]/60 rounded-xl p-3">
            <p className="text-2xl text-pink-600">{encouragementCount}</p>
            <p className="text-xs text-purple-600">Cheers</p>
          </div>
        )}
      </div>
    </div>
  );
}
