/**
 * FlowState Application Constants
 * 
 * Centralized constants for life areas, themes, and configurations
 */

// ============================================================================
// LIFE AREAS
// ============================================================================

export interface LifeAreaConfig {
  id: string;
  icon: string;
  title: string;
  suggestion: string;
  color: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

export const LIFE_AREAS: LifeAreaConfig[] = [
  {
    id: 'health',
    icon: '❤️',
    title: 'Health',
    suggestion: 'Your body deserves gentle care',
    color: '#f59e0b',
    bgColor: 'var(--life-health-bg)',
    borderColor: 'var(--life-health-border)',
    textColor: 'var(--life-health-text)',
  },
  {
    id: 'work',
    icon: '💼',
    title: 'Work',
    suggestion: 'Progress over perfection',
    color: '#8b5cf6',
    bgColor: 'var(--life-work-bg)',
    borderColor: 'var(--life-work-border)',
    textColor: 'var(--life-work-text)',
  },
  {
    id: 'self-care',
    icon: '🧘',
    title: 'Self-Care',
    suggestion: 'You deserve this time',
    color: '#a78bfa',
    bgColor: '#fae8ff',
    borderColor: '#e879f9',
    textColor: '#701a75',
  },
  {
    id: 'relationships',
    icon: '💕',
    title: 'Relationships',
    suggestion: 'Connection nurtures the soul',
    color: '#ec4899',
    bgColor: 'var(--life-social-bg)',
    borderColor: 'var(--life-social-border)',
    textColor: 'var(--life-social-text)',
  },
  {
    id: 'personal-growth',
    icon: '🌱',
    title: 'Personal Growth',
    suggestion: 'Small steps lead to big growth',
    color: '#10b981',
    bgColor: 'var(--life-personal-bg)',
    borderColor: 'var(--life-personal-border)',
    textColor: 'var(--life-personal-text)',
  },
  {
    id: 'environment',
    icon: '🏡',
    title: 'Environment',
    suggestion: 'A calm space supports you',
    color: '#84cc16',
    bgColor: '#ecfccb',
    borderColor: '#a3e635',
    textColor: '#3f6212',
  },
  {
    id: 'creativity',
    icon: '🎨',
    title: 'Creativity',
    suggestion: 'Express yourself freely',
    color: '#d946ef',
    bgColor: 'var(--life-creative-bg)',
    borderColor: 'var(--life-creative-border)',
    textColor: 'var(--life-creative-text)',
  },
  {
    id: 'finances',
    icon: '💰',
    title: 'Finances',
    suggestion: 'Financial peace brings calm',
    color: '#06b6d4',
    bgColor: '#cffafe',
    borderColor: '#22d3ee',
    textColor: '#164e63',
  },
];

// Helper to get life area by ID
export function getLifeAreaById(id: string): LifeAreaConfig | undefined {
  return LIFE_AREAS.find(area => area.id.toLowerCase() === id.toLowerCase());
}

// Helper to get life area color
export function getLifeAreaColor(id: string): string {
  return getLifeAreaById(id)?.color || '#a78bfa';
}

// ============================================================================
// MOOD TYPES
// ============================================================================

export const MOOD_TYPES = [
  { id: 'struggling', label: 'Struggling', emoji: '😔', color: '#3b82f6' },
  { id: 'low-energy', label: 'Low Energy', emoji: '😴', color: '#6366f1' },
  { id: 'okay', label: 'Okay', emoji: '😊', color: '#f59e0b' },
  { id: 'good', label: 'Good', emoji: '😄', color: '#10b981' },
  { id: 'energized', label: 'Energized', emoji: '🌟', color: '#22c55e' },
] as const;

export type MoodType = typeof MOOD_TYPES[number]['id'];

// ============================================================================
// ENERGY LEVELS
// ============================================================================

export const ENERGY_LEVELS = [
  { id: 'low', label: 'Low', color: '#ef4444', description: 'Rest & gentle activities' },
  { id: 'medium', label: 'Medium', color: '#f59e0b', description: 'Moderate tasks' },
  { id: 'high', label: 'High', color: '#10b981', description: 'Deep work & challenges' },
] as const;

export type EnergyLevel = typeof ENERGY_LEVELS[number]['id'];

// ============================================================================
// PRIORITY LEVELS
// ============================================================================

export const PRIORITY_LEVELS = [
  { id: 'low', label: 'Low', color: '#94a3b8' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'high', label: 'High', color: '#ef4444' },
] as const;

export type PriorityLevel = typeof PRIORITY_LEVELS[number]['id'];

// ============================================================================
// THEME COLORS
// ============================================================================

export const THEME_COLORS = {
  lavender: {
    primary: '#a78bfa',
    light: '#ddd6fe',
    dark: '#7c3aed',
    gradient: 'from-white to-lavender-50',
  },
  mint: {
    primary: '#34d399',
    light: '#a7f3d0',
    dark: '#059669',
    gradient: 'from-white to-emerald-50',
  },
  peach: {
    primary: '#fb923c',
    light: '#fed7aa',
    dark: '#ea580c',
    gradient: 'from-white to-orange-50',
  },
} as const;

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  // User preferences
  THEME: 'flowstate-theme',
  FONT_SIZE: 'flowstate-fontsize',
  MINIMAL_MODE: 'flowstate-minimal',
  DARK_MODE: 'flowstate-darkmode',
  NUDGES_ENABLED: 'flowstate-nudges',
  
  // User state
  MOOD: 'flowstate-mood',
  MOOD_DATE: 'flowstate-mood-date',
  LAST_CHECK_IN: 'flowstate-last-checkin',
  
  // Navigation
  NAVIGATION_STATE: 'flowstate-navigation-state',
  
  // Features
  HABITS: 'flowstate-habits',
  TODOS: 'flowstate-todos',
  REFLECTIONS: 'flowstate-reflections',
  SYMPTOMS: 'flowstate-symptoms',
} as const;

// ============================================================================
// APP CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  APP_NAME: 'FlowState',
  VERSION: '3.0.0',
  DEFAULT_THEME: 'Lavender' as const,
  DEFAULT_FONT_SIZE: 'Medium' as const,
  
  // Animation durations (ms)
  ANIMATION: {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
  },
  
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  HABIT_STACKING: true,
  SYMPTOM_TRACKING: true,
  COMMUNITY: true,
  INTEGRATIONS: true,
  AI_COACH: true,
  WEATHER_MOON: true,
  OFFLINE_MODE: true,
  ANALYTICS: true,
} as const;
