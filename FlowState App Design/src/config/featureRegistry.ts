import { 
  Home, 
  Activity, 
  CheckSquare, 
  Calendar, 
  Book, 
  MessageCircle,
  TrendingUp,
  Target,
  Clock,
  Zap,
  GraduationCap,
  Link2,
  Users,
  Stethoscope,
  Settings,
  type LucideIcon
} from 'lucide-react';

export interface FeatureDefinition {
  key: string;
  label: string;
  icon: LucideIcon;
  description: string;
  category: 'core' | 'productivity' | 'wellness' | 'growth' | 'advanced';
  defaultEnabled: boolean;
  dependencies?: string[];
}

export const FEATURE_REGISTRY: Record<string, FeatureDefinition> = {
  home: {
    key: 'home',
    label: 'Home',
    icon: Home,
    description: 'Your personalized dashboard',
    category: 'core',
    defaultEnabled: true,
  },
  checkin: {
    key: 'checkin',
    label: 'Check-In',
    icon: Activity,
    description: 'Track your energy and mood',
    category: 'core',
    defaultEnabled: true,
  },
  todos: {
    key: 'todos',
    label: 'To-Dos',
    icon: CheckSquare,
    description: 'Manage tasks that adapt to your energy',
    category: 'productivity',
    defaultEnabled: true,
  },
  habits: {
    key: 'habits',
    label: 'Habits',
    icon: Target,
    description: 'Build sustainable habits',
    category: 'wellness',
    defaultEnabled: false,
  },
  calendar: {
    key: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    description: 'Energy-aware scheduling',
    category: 'productivity',
    defaultEnabled: false,
  },
  reflection: {
    key: 'reflection',
    label: 'Reflection',
    icon: Book,
    description: 'Journal and reflect on your day',
    category: 'wellness',
    defaultEnabled: false,
  },
  coaching: {
    key: 'coaching',
    label: 'AI Coach',
    icon: MessageCircle,
    description: 'Get personalized guidance',
    category: 'growth',
    defaultEnabled: false,
  },
  growth: {
    key: 'growth',
    label: 'Growth Map',
    icon: TrendingUp,
    description: 'Visualize your progress',
    category: 'growth',
    defaultEnabled: false,
  },
  focus: {
    key: 'focus',
    label: 'Focus Tools',
    icon: Clock,
    description: 'Timers and focus modes',
    category: 'productivity',
    defaultEnabled: false,
  },
  timeflow: {
    key: 'timeflow',
    label: 'Time Flow',
    icon: Zap,
    description: 'Drag-and-drop time blocking',
    category: 'productivity',
    defaultEnabled: false,
  },
  discipline: {
    key: 'discipline',
    label: 'Discipline Builder',
    icon: Target,
    description: 'Build consistency and discipline',
    category: 'growth',
    defaultEnabled: false,
  },
  education: {
    key: 'education',
    label: 'Habit Education',
    icon: GraduationCap,
    description: 'Learn about habit science',
    category: 'growth',
    defaultEnabled: false,
  },
  integrations: {
    key: 'integrations',
    label: 'Integrations',
    icon: Link2,
    description: 'Connect your favorite tools',
    category: 'advanced',
    defaultEnabled: false,
  },
  community: {
    key: 'community',
    label: 'Community',
    icon: Users,
    description: 'Connect with others',
    category: 'wellness',
    defaultEnabled: false,
  },
  symptomTracker: {
    key: 'symptomTracker',
    label: 'Symptom Tracker',
    icon: Stethoscope,
    description: 'Track symptoms and patterns',
    category: 'wellness',
    defaultEnabled: false,
  },
  settings: {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'App preferences',
    category: 'core',
    defaultEnabled: true,
  },
};

export const FEATURE_CATEGORIES = {
  core: { label: 'Core Features', color: '#A78BFA' },
  productivity: { label: 'Productivity', color: '#3B82F6' },
  wellness: { label: 'Wellness', color: '#10B981' },
  growth: { label: 'Personal Growth', color: '#8B5CF6' },
  advanced: { label: 'Advanced', color: '#6366F1' },
};

export function getFeaturesByCategory(category: string) {
  return Object.values(FEATURE_REGISTRY).filter(f => f.category === category);
}

export function getEnabledFeatures(enabledFeatures: Record<string, boolean>) {
  return Object.keys(enabledFeatures).filter(key => enabledFeatures[key]);
}
