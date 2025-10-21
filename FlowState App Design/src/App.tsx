import React, { useEffect } from 'react';
import { ThemeProvider } from './components/context/ThemeContext';
import { EmotionalStateProvider } from './components/manager/EmotionalStateManager';
import { NotificationProvider, EnhancedNotificationDisplay } from './components/system/EnhancedNotificationSystem';
import { NavigationProvider, useNavigation } from './components/context/NavigationContext';
import { UserConfigProvider } from './config/UserConfigContext';
import { MindfulNotificationDisplay } from './components/system/MindfulNotificationSystem';
import { GentleModeOverlay } from './components/overlay/GentleModeOverlay';
import { ScreenLabel } from './components/overlay/ScreenLabel';
import { DevOverlayProvider } from './components/overlay/DevOverlayContext';
// import { useNudgeSystem } from './components/system/NudgeSystem';
import { NavigationTransition } from './components/transition/NavigationTransition';
import { ScreenTransitionLoader } from './components/loader/ScreenTransitionLoader';
import { AnimatedBottomNav } from './components/nav/AnimatedBottomNav';
import { AnimatedMoreMenu } from './components/menu/AnimatedMoreMenu';
import { ScrollToTop } from './components/ScrollToTop';
//import { PageLoadingState } from './components/state/PageLoadingState';
import { Toaster } from './components/ui/sonner';
import { useMoodCheck } from './hooks/useMoodCheck';
import { useScreenTransition } from './hooks/useScreenTransition';
import { migrateLocalStorage } from './lib/localStorage-migration';
import { DevTools } from './components/tools/DevTools';
import { OnboardingWrapper } from './screens/OnboardingScreen';
import { useConfigSync } from './hooks/useConfigSync';
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
// SCREENS 
// ============================================================================

import { CheckInScreen } from './screens/CheckInScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { TodosScreen } from './screens/TodosScreen';
//import { HabitBuilderScreen } from './screens/HabitBuilderScreen';
import { CoachingScreen } from './screens/CoachingScreen';
//import { CoachChatScreen } from './screens/CoachChatScreen';
//import { GrowthMapScreen } from './screens/GrowthMapScreen';
import { ReflectionScreen } from './screens/ReflectionScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { FocusToolsScreen } from './screens/FocusToolsScreen';
import { TimeFlowScreen } from './screens/TimeFlowScreen';
//import {DisciplineBuilderScreen } from './screens/DisciplineBuilderScreen';
//import { HabitEducationScreen } from './screens/HabitEducationScreen';
//import { IntegrationsScreen } from './screens/IntegrationsScreen';
import { SymptomTrackerScreen } from './screens/SymptomTrackerScreen';
//import { CommunityScreen } from './screens/CommunityScreen';
import { WeeklyInsightsDashboard } from './screens/WeeklyInsightsDashboard';
import { SettingsScreen } from './screens/SettingsScreen';

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
  const { navigate, currentScreen,  } = useNavigation();
  const { hasSetMood, setMood } = useMoodCheck();
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  
  // Sync user configuration with theme and app settings
  useConfigSync();
  
  // Initialize nudge system
  // useNudgeSystem();
  
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
    console.log('🎯 handleCheckInComplete called with mood:', mood);
    // Update mood state before navigating
    setMood(mood);
    console.log('💾 Mood state updated, navigating to home...');
    navigate('home');
  }, [navigate, setMood]);

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
  {currentScreen === 'coach' && <CoachingScreen onNavigate={handleNavigate} />}
  {/* {currentScreen === 'coach-chat' && <CoachChatScreen onNavigate={handleNavigate} />} */}
  {/* {currentScreen === 'growth-map' && (
    <GrowthMapScreen
      onNavigate={(screen, area) => {
        if (area && screen === 'habits') {
          navigate('habit-builder', { selectedArea: area });
        } else {
          navigate(screen as any);
        }
      }}
    />
  )} */}
  {currentScreen === 'todos' && <TodosScreen />}
  {currentScreen === 'focus-tools' && <FocusToolsScreen />}
  {/* {currentScreen === 'habit-builder' 
   // <HabitBuilderScreen initialSelectedArea={params.selectedArea} />
  )} */}
  {currentScreen === 'timeflow' && <TimeFlowScreen />}
  {currentScreen === 'reflection' && <ReflectionScreen />}
  {currentScreen === 'calendar' && <CalendarScreen />}
  {currentScreen === 'settings' && <SettingsScreen />}
  {/* {currentScreen === 'discipline-builder' && <DisciplineBuilderScreen />}
  {currentScreen === 'habit-education' && <HabitEducationScreen />}
  {currentScreen === 'integrations' && <IntegrationsScreen />} */}
  {currentScreen === 'symptom-tracker' && (
    <SymptomTrackerScreen onNavigate={handleNavigate} />
  )}
  {/* {currentScreen === 'community' && (
    //<CommunityScreen onNavigate={handleNavigate} />
  )} */}
  {currentScreen === 'weekly-insights' && (
    <WeeklyInsightsDashboard onNavigate={handleNavigate} />
  )}
</NavigationTransition>

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

  {/* Developer: current screen label (top-left) */}
  <ScreenLabel />

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
      
      {/* Developer Tools (accessible via ?devtools=true) */}
      <DevTools />
    </div>
  );
}

// ============================================================================
// ROOT APP COMPONENT
// ============================================================================

export default function App() {
  // Run localStorage migration on app startup
  useEffect(() => {
    migrateLocalStorage();
  }, []);

  return (
    <UserConfigProvider>
      <ThemeProvider>
        <EmotionalStateProvider>
          <NotificationProvider>
            <NavigationProvider persist initialScreen="home">
              <OnboardingWrapper>
                { (import.meta as any)?.env?.DEV ? (
                  <DevOverlayProvider>
                    <AppContent />
                  </DevOverlayProvider>
                ) : (
                  <AppContent />
                ) }
              </OnboardingWrapper>
            </NavigationProvider>
          </NotificationProvider>
        </EmotionalStateProvider>
      </ThemeProvider>
    </UserConfigProvider>
  );
}