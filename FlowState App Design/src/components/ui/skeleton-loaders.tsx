/**
 * Skeleton Loaders
 * 
 * Loading states for Dashboard, Coach, and other screens
 * Matches the actual component layouts for smooth transitions
 */

import React from 'react';
import { motion } from 'motion/react';

// ============================================================================
// BASE SKELETON COMPONENTS
// ============================================================================

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    < div
      className={`bg-gray-200 rounded ${className}`}
      animate={animate ? {
        opacity: [0.5, 0.8, 0.5],
      } : undefined}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export function SkeletonCircle({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return <Skeleton className={`rounded-full ${sizeClasses[size]} ${className}`} />;
}

export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// DASHBOARD SKELETON
// ============================================================================

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-100 via-lavender-50 to-white p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Momentum Ring Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-lavender-100 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <SkeletonCircle size="lg" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto mb-4 scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-32 h-24 flex-shrink-0 rounded-2xl" />
        ))}
      </div>

      {/* Today's Tasks */}
      <div className="mb-4">
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100">
              <div className="flex items-start gap-3">
                <SkeletonCircle size="sm" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Widget */}
      <div className="bg-gradient-to-br from-lavender-100 to-peach-100 rounded-3xl p-6 border-2 border-lavender-200">
        <div className="flex items-center gap-3 mb-4">
          <SkeletonCircle size="md" />
          <div className="flex-1">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}

// ============================================================================
// COACH CHAT SKELETON
// ============================================================================

export function CoachChatSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <SkeletonCircle size="md" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4">
        {/* Coach message */}
        <div className="flex gap-3">
          <SkeletonCircle size="sm" />
          <div className="flex-1 max-w-[80%]">
            <div className="bg-lavender-100 rounded-3xl rounded-tl-lg p-4">
              <SkeletonText lines={2} />
            </div>
            <Skeleton className="h-3 w-16 mt-1 ml-2" />
          </div>
        </div>

        {/* User message */}
        <div className="flex gap-3 justify-end">
          <div className="flex-1 max-w-[80%] flex flex-col items-end">
            <div className="bg-lavender-400 rounded-3xl rounded-tr-lg p-4 w-full">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-3 w-16 mt-1 mr-2" />
          </div>
          <SkeletonCircle size="sm" />
        </div>

        {/* Coach message */}
        <div className="flex gap-3">
          <SkeletonCircle size="sm" />
          <div className="flex-1 max-w-[80%]">
            <div className="bg-lavender-100 rounded-3xl rounded-tl-lg p-4">
              <SkeletonText lines={3} />
            </div>
            <Skeleton className="h-3 w-16 mt-1 ml-2" />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-12 rounded-full" />
          <SkeletonCircle size="md" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TODOS SKELETON
// ============================================================================

export function TodosSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-20 h-8 rounded-full" />
          ))}
        </div>
      </div>

      {/* Add Todo */}
      <Skeleton className="h-14 w-full rounded-2xl mb-6" />

      {/* Todo List */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100">
            <div className="flex items-start gap-3">
              <SkeletonCircle size="sm" />
              <div className="flex-1">
                <Skeleton className="h-5 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CALENDAR SKELETON
// ============================================================================

export function CalendarSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <SkeletonCircle size="sm" />
      </div>

      {/* Month View */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

      {/* Events List */}
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-lavender-50 rounded-2xl p-4 border-2 border-lavender-100">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// REFLECTION SKELETON
// ============================================================================

export function ReflectionSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-peach-50 to-white p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Prompt Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-peach-200 mb-4">
        <Skeleton className="h-5 w-32 mb-4" />
        <SkeletonText lines={2} />
      </div>

      {/* Reflection Input */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 mb-4">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>

      {/* Gratitude Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-200">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SETTINGS SKELETON
// ============================================================================

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 pb-24">
      {/* Header */}
      <Skeleton className="h-8 w-32 mb-6" />

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <SkeletonCircle size="lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {[1, 2, 3].map((group) => (
          <div key={group}>
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// HABIT BUILDER SKELETON
// ============================================================================

export function HabitBuilderSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white p-4 pb-24">
      {/* Header */}
      <Skeleton className="h-8 w-40 mb-6" />

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <SkeletonCircle size="md" />
            <Skeleton className="h-3 w-12 mt-2" />
          </div>
        ))}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-lavender-100 mb-4">
        <Skeleton className="h-6 w-48 mb-4" />
        <SkeletonText lines={2} className="mb-6" />
        
        {/* Options */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  );
}

// ============================================================================
// GENERIC CARD SKELETON
// ============================================================================

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100 ${className}`}>
      <Skeleton className="h-5 w-3/4 mb-3" />
      <SkeletonText lines={2} />
    </div>
  );
}

// ============================================================================
// LIST SKELETON
// ============================================================================

export function ListSkeleton({ 
  items = 5, 
  className = '' 
}: { 
  items?: number; 
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
