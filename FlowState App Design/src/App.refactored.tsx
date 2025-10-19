/**
 * FlowState App - Refactored v3.0
 * 
 * Clean, optimized main app component with:
 * - NavigationContext integration
 * - Lazy-loaded screens
 * - Optimized re-renders
 * - Centralized state management
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { EmotionalStateProvider } from './components/EmotionalStateManager';
import { NotificationProvider, EnhancedNotificationDisplay } from './components/EnhancedNotificationSystem';
import { NavigationProvider, useNavigation } from './components/NavigationContext';
import { MindfulNotificationDisplay } from './components/MindfulNotificationSystem';
import { GentleModeOverlay } from './components/GentleModeOverlay';
import { useNudgeSystem } from './components/NudgeSystem';
import { NavigationTransition } from './components/NavigationTransition';
import { ScreenTransitionLoader } from './components/ScreenTransitionLoader';
import { AnimatedBottomNav } from './components/AnimatedBottomNav';
import { AnimatedMoreMenu } from './components/AnimatedMoreMenu';
import { ScrollToTop } from './components/ScrollToTop';
import { PageLoadingState } from './components/PageLoadingState';
import { Toaster } from './components/ui/sonner';
import { useMoodCheck } from './hooks/useMoodCheck';
import { useScreenTransition } from './hooks/useScreenTransition';
import {
  Home,
  ListTodo,
  Heart,
  Calendar,
  Settings,
  Timer,
  MessageCircleHeart,
  Target,
  Clock,
  Flower2,
  MoreHorizontal,
  Sparkles,
  Zap,
  BookOpen,
  Link2,
  Activity,
  Users,
} from 'lucide-react';

// ============================================================================
// LAZY-LOADED SCREENS
// ============================================================================

const CheckInScreen = lazy(() =>
  import('./components/CheckInScreen').then(m => ({ default: m.CheckInScreen }))
);
const DashboardScreen = lazy(() =>
  import('./components/DashboardScreen').then(m => ({ default: m.DashboardScreen }))
);
const TodosScreen = lazy(() =>
  import('./components/TodosScreen').then(m => ({ default: m.TodosScreen }))
);
const HabitBuilderScreen = lazy(() =>
  import('./components/HabitBuilderScreen').then(m => ({ default: m.HabitBuilderScreen }))
);
const CoachingScreen = lazy(() =>
  import('./components/CoachingScreen').then(m => ({ default: m.CoachingScreen }))
);
const CoachChatScreen = lazy(() =>
  import('./components/CoachChatScreen').then(m => ({ default: m.CoachChatScreen }))
);
const GrowthMapScreen = lazy(() =>
  import('./components/GrowthMapScreen').then(m => ({ default: m.GrowthMapScreen }))
);
const ReflectionScreen = lazy(() =>
  import('./components/ReflectionScreen').then(m => ({ default: m.ReflectionScreen }))
);
const CalendarScreen = lazy(() =>
  import('./components/CalendarScreen').then(m => ({ default: m.CalendarScreen }))
);
const FocusToolsScreen = lazy(() =>
  import('./components/FocusToolsScreen').then(m => ({ default: m.FocusToolsScreen }))
);
const TimeFlowScreen = lazy(() =>
  import('./components/TimeFlowScreen').then(m => ({ default: m.TimeFlowScreen }))
);
const DisciplineBuilderScreen = lazy(() =>
  import('./components/DisciplineBuilderScreen').then(m => ({ default: m.DisciplineBuilderScreen }))
);
const HabitEducationScreen = lazy(() =>
  import('./components/HabitEducationScreen').then(m => ({ default: m.HabitEducationScreen }))
);
const IntegrationsScreen = lazy(() =>
  import('./components/IntegrationsScreen').then(m => ({ default: m.IntegrationsScreen }))
);
const SymptomTrackerScreen = lazy(() =>
  import('./components/SymptomTrackerScreen').then(m => ({ default: m.SymptomTrackerScreen }))
);
const CommunityScreen = lazy(() =>
  import('./components/CommunityScreen').then(m => ({ default: m.CommunityScreen }))
);
const WeeklyInsightsDashboard = lazy(() =>
  import('./components/WeeklyInsightsDashboard').then(m => ({ default: m.WeeklyInsightsDashboard }))
);

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'todos', label: 'To-Dos', icon: ListTodo },
  { id: 'habit-builder', label: 'Habits', icon: Target },
  { id: 'coach', label: 'Coach', icon: MessageCircleHeart },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

const MORE_MENU_CATEGORIES = [
  {
    category: 'Progress & Growth',
    items: [
      { id: 'weekly-insights', label: 'Weekly Insights', icon: Sparkles, description: 'Mood, sleep & life area analytics' },
      { id: 'growth-map', label: 'Growth Map', icon: Flower2, description: 'Visualize your holistic progress' },
      { id: 'reflection', label: 'Daily Reflection', icon: Heart, description: 'End-of-day mindful check-in' },
      { id: 'discipline-builder', label: 'Discipline Builder', icon: Zap, description: 'Build mental strength & resilience' },
      { id: 'symptom-tracker', label: 'Symptom Tracker', icon: Activity, description: 'Track patterns & find correlations' },
    ],
  },
  {
    category: 'Time & Focus',
    items: [
      { id: 'timeflow', label: 'Time Flow', icon: Clock, description: 'Visual timeline & task scheduler' },
      { id: 'focus-tools', label: 'Focus Tools', icon: Timer, description: 'Timers, breathing & deep work' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, description: 'View your schedule & events' },
    ],
  },
  {
    category: 'Learning & Support',
    items: [
      { id: 'habit-education', label: 'Habit Education', icon: BookOpen, description: 'Learn the psychology of habits' },
      { id: 'coach-chat', label: 'AI Coach Chat', icon: Sparkles, description: 'Personal coaching conversation' },
      { id: 'community', label: 'Community', icon: Users, description: 'Connect, share & support circles' },
    ],
  },
  {
    category: 'Settings & Tools',
    items: [
      { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Connect health & calendar apps' },
      { id: 'settings', label: 'Settings', icon: Settings, description: 'Customize your experience' },
    ],
  },
];

// ============================================================================
// MAIN APP CONTENT
// ============================================================================

function AppContent() {
  const { navigate, currentScreen, params } = useNavigation();
  const { hasSetMood } = useMoodCheck();
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  
  // Initialize nudge system
  useNudgeSystem();
  
  // Screen transition management
  const { isTransitioning } = useScreenTransition(currentScreen);

  // Redirect to check-in if mood not set
  useEffect(() => {
    if (!hasSetMood && currentScreen !== 'checkin') {
      navigate('checkin');
    }
  }, [hasSetMood, currentScreen, navigate]);

  // Navigation handlers
  const handleNavigate = React.useCallback((screenId: string) => {
    if (screenId === 'more') {
      setShowMoreMenu(true);
    } else {
      navigate(screenId as any);
    }
  }, [navigate]);

  const handleCheckInComplete = React.useCallback((mood: string) => {
    navigate('home');
  }, [navigate]);

  const handleNavigateToHabits = React.useCallback((lifeArea: string) => {
    navigate('habit-builder', { selectedArea: lifeArea });
  }, [navigate]);

  // Map navigation screen names to legacy screen names for compatibility
  const screenMapping: Record<string, string> = {
    'home': 'home',
    'checkin': 'checkin',
    'todos': 'todos',
    'habit-builder': 'habits',
    'habit-stacking': 'habit-stacking',
    'habit-education': 'education',
    'coach': 'coaching',
    'coach-chat': 'coach-chat',
    'growth-map': 'growth-map',
    'reflection': 'reflection',
    'calendar': 'calendar',
    'focus-tools': 'focus',
    'timeflow': 'timeflow',
    'discipline-builder': 'discipline',
    'settings': 'settings',
    'integrations': 'integrations',
    'symptom-tracker': 'symptoms',
    'community': 'community',
    'weekly-insights': 'weekly-insights',
  };

  const legacyScreen = screenMapping[currentScreen] || currentScreen;

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Progress bar during transitions */}
      <ScreenTransitionLoader isTransitioning={isTransitioning} />
      
      {/* Auto scroll to top on screen change */}
      <ScrollToTop screenKey={currentScreen} />

      {/* Screen Content with Animations */}
      <div className="relative min-h-screen bg-white overflow-x-hidden">
        <Suspense fallback={<PageLoadingState />}>
          <NavigationTransition screenKey={currentScreen} direction="up">
            {currentScreen === 'checkin' && (
              <CheckInScreen onComplete={handleCheckInComplete} />
            )}
            {currentScreen === 'home' && (
              <DashboardScreen
                onNavigateToHabits={handleNavigateToHabits}
                onNavigate={handleNavigate}
              />
            )}
            {currentScreen === 'coach' && (
              <CoachingScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'coach-chat' && (
              <CoachChatScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'growth-map' && (
              <GrowthMapScreen
                onNavigate={(screen, area) => {
                  if (area && screen === 'habits') {
                    navigate('habit-builder', { selectedArea: area });
                  } else {
                    navigate(screen as any);
                  }
                }}
              />
            )}
            {currentScreen === 'todos' && <TodosScreen />}
            {currentScreen === 'focus-tools' && <FocusToolsScreen />}
            {currentScreen === 'habit-builder' && (
              <HabitBuilderScreen initialSelectedArea={params.selectedArea} />
            )}
            {currentScreen === 'timeflow' && <TimeFlowScreen />}
            {currentScreen === 'reflection' && <ReflectionScreen />}
            {currentScreen === 'calendar' && <CalendarScreen />}
            {currentScreen === 'settings' && <SettingsScreen />}
            {currentScreen === 'discipline-builder' && <DisciplineBuilderScreen />}
            {currentScreen === 'habit-education' && <HabitEducationScreen />}
            {currentScreen === 'integrations' && <IntegrationsScreen />}
            {currentScreen === 'symptom-tracker' && (
              <SymptomTrackerScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'community' && (
              <CommunityScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'weekly-insights' && (
              <WeeklyInsightsDashboard onNavigate={handleNavigate} />
            )}
          </NavigationTransition>
        </Suspense>
      </div>

      {/* Animated Bottom Navigation */}
      {currentScreen !== 'checkin' && (
        <AnimatedBottomNav
          navItems={NAV_ITEMS}
          currentScreen={legacyScreen}
          onNavigate={handleNavigate}
        />
      )}

      {/* Animated More Menu */}
      <AnimatedMoreMenu
        isOpen={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        categories={MORE_MENU_CATEGORIES}
        currentScreen={legacyScreen}
        onNavigate={handleNavigate}
      />
      
      {/* Gentle Mode Overlay */}
      <GentleModeOverlay />

      {/* Mindful Notifications */}
      <MindfulNotificationDisplay />

      {/* Enhanced Notification System */}
      <EnhancedNotificationDisplay />

      {/* Toast notifications */}
      <Toaster
        position="bottom-center"
        duration={2000}
        toastOptions={{
          className: 'gentle-nudge-toast',
          style: {
            marginBottom: '90px',
            background: 'rgba(30, 41, 59, 0.95)',
            color: 'white',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          },
        }}
      />
    </div>
  );
}

// ============================================================================
// ROOT APP COMPONENT
// ============================================================================

export default function App() {
  return (
    <ThemeProvider>
      <EmotionalStateProvider>
        <NotificationProvider>
          <NavigationProvider persist initialScreen="home">
            <AppContent />
          </NavigationProvider>
        </NotificationProvider>
      </EmotionalStateProvider>
    </ThemeProvider>
  );
}
