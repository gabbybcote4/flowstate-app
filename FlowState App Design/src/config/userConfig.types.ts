// UserConfig.types.ts

export type ThemeMode = 'light' | 'dark' | 'minimal' | 'auto';
export type TonePreference = 'gentle' | 'motivating' | 'practical' | 'playful';
export type WidgetSize = 'S' | 'M' | 'L';
export type DashboardTemplate = 'planner' | 'wellness' | 'hybrid' | 'custom';

export interface LifeArea {
  id: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface DashboardWidget {
  id: string;
  type: string;
  size: WidgetSize;
  position: number;
  config?: Record<string, any>;
}

export interface NotificationConfig {
  enabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  checkInReminders: boolean;
  habitReminders: boolean;
  encouragement: boolean;
  insights: boolean;
  frequency: 'minimal' | 'moderate' | 'frequent';
}

export interface IntegrationConfig {
  id: string;
  name: string;
  enabled: boolean;
  connected: boolean;
  scopes: string[];
}

export interface RoutineByMood {
  high: string[];
  medium: string[];
  low: string[];
}

export interface JournalingConfig {
  enabled: boolean;
  prompts: boolean;
  dailyReflection: boolean;
  gratitude: boolean;
  morningPages: boolean;
}

export interface UserConfig {
  version: number;
  
  // core preferences
  tone: TonePreference;
  theme: {
    mode: ThemeMode;
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  
  // life areas
  lifeAreas: LifeArea[];
  
  // features
  enabledFeatures: Record<string, boolean>;
  
  // navigation
  navOrder: string[];
  
  // dashboard
  dashboardLayout: DashboardWidget[];
  dashboardTemplate: DashboardTemplate;
  
  // widgets
  widgets: {
    weather: boolean;
    moon: boolean;
    healthStats: boolean;
    weeklySummary: boolean;
    todos: boolean;
    habits: boolean;
    focusTimer: boolean;
    aiInsights: boolean;
    momentum: boolean;
  };
  
  // journaling
  journaling: JournalingConfig;
  
  // notifications
  notifications: NotificationConfig;
  
  // integrations
  integrations: IntegrationConfig[];
  
  // routines by mood
  routines: {
    byMood: RoutineByMood;
  };
  
  // onboarding
  onboardingCompleted: boolean;
  onboardingStep: number;
}

export const DEFAULT_LIFE_AREAS: LifeArea[] = [
  { id: 'health', label: 'Health & Wellness', icon: '💚', color: '#10B981', enabled: true },
  { id: 'work', label: 'Work & Career', icon: '💼', color: '#3B82F6', enabled: true },
  { id: 'relationships', label: 'Relationships', icon: '💜', color: '#A78BFA', enabled: true },
  { id: 'personal', label: 'Personal Growth', icon: '🌱', color: '#8B5CF6', enabled: true },
  { id: 'creativity', label: 'Creativity', icon: '🎨', color: '#EC4899', enabled: false },
  { id: 'finance', label: 'Finance', icon: '💰', color: '#F59E0B', enabled: false },
  { id: 'home', label: 'Home & Living', icon: '🏡', color: '#14B8A6', enabled: false },
  { id: 'learning', label: 'Learning', icon: '📚', color: '#6366F1', enabled: false },
];

export const DEFAULT_USER_CONFIG: UserConfig = {
  version: 1,
  
  tone: 'gentle',
  
  theme: {
    mode: 'light',
    primaryColor: '#A78BFA',
    fontSize: 'medium',
  },
  
  lifeAreas: DEFAULT_LIFE_AREAS,
  
  enabledFeatures: {
    checkin: true,
    home: true,
    todos: true,
    habits: false,
    calendar: false,
    reflection: false,
    coaching: false,
    growth: false,
    focus: false,
    timeflow: false,
    discipline: false,
    education: false,
    integrations: false,
    community: false,
    symptomTracker: false,
  },
  
  navOrder: ['home', 'checkin', 'todos', 'reflection', 'settings'],
  
  dashboardLayout: [],
  dashboardTemplate: 'wellness',
  
  widgets: {
    weather: false,
    moon: false,
    healthStats: false,
    weeklySummary: true,
    todos: true,
    habits: false,
    focusTimer: false,
    aiInsights: false,
    momentum: true,
  },
  
  journaling: {
    enabled: false,
    prompts: true,
    dailyReflection: false,
    gratitude: false,
    morningPages: false,
  },
  
  notifications: {
    enabled: true,
    checkInReminders: true,
    habitReminders: false,
    encouragement: true,
    insights: false,
    frequency: 'minimal',
  },
  
  integrations: [
    { id: 'appleHealth', name: 'Apple Health', enabled: false, connected: false, scopes: ['read'] },
    { id: 'googleFit', name: 'Google Fit', enabled: false, connected: false, scopes: ['read'] },
    { id: 'googleCalendar', name: 'Google Calendar', enabled: false, connected: false, scopes: ['read'] },
    { id: 'outlook', name: 'Outlook Calendar', enabled: false, connected: false, scopes: ['read'] },
    { id: 'spotify', name: 'Spotify', enabled: false, connected: false, scopes: ['read'] },
    { id: 'notion', name: 'Notion', enabled: false, connected: false, scopes: ['read', 'write'] },
    { id: 'openweather', name: 'OpenWeather', enabled: false, connected: false, scopes: [] },
  ],
  
  routines: {
    byMood: {
      high: [],
      medium: [],
      low: [],
    },
  },
  
  onboardingCompleted: false,
  onboardingStep: 0,
};
