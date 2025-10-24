// src/App.tsx
// main application wrapper and navigation controller

import React, { useEffect } from "react";

import { UserConfigProvider } from "./config/UserConfigContext";
import { ThemeProvider } from "./components/ThemeContext";
import {
  NotificationProvider,
  EnhancedNotificationDisplay,
} from "./components/system/EnhancedNotificationSystem";
import {
  NavigationProvider,
  useNavigation,
} from "./components/context/NavigationContext";
import { NavigationTransition } from "./components/NavigationTransition";
import { AnimatedBottomNav } from "./components/AnimatedBottomNav";
import { AnimatedMoreMenu } from "./components/AnimatedMoreMenu";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "./components/ui/sonner";

import { useMoodCheck } from "./hooks/useMoodCheck";
import { useConfigSync } from "./hooks/useConfigSync";
import { migrateLocalStorage } from "./lib/localStorage-migration";

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
} from "lucide-react";

// screen imports
import { CheckInScreen } from "./screens/CheckInScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
// import { TodosScreen } from "./screens/TodosScreen";
import { CoachingScreen } from "./screens/CoachingScreen";
import { ReflectionScreen } from "./screens/ReflectionScreen";
// import { CalendarScreen } from "./screens/CalendarScreen";
import { FocusToolsScreen } from "./screens/FocusToolsScreen";
// import { TimeFlowScreen } from "./screens/TimeFlowScreen";
import { SymptomTrackerScreen } from "./screens/SymptomTrackerScreen";
import { WeeklyInsightsDashboard } from "./screens/WeeklyInsightsDashboard";
import { SettingsScreen } from "./screens/SettingsScreen";
import { OnboardingWrapper } from "./screens/OnboardingScreen";
// import { HabitBuilderScreen } from "./screens/HabitBuilderScreen";
// import { DisciplineBuilderScreen } from "./screens/DisciplineBuilderScreen";
// import { IntegrationsScreen } from "./screens/IntegrationsScreen";
// import { CommunityScreen } from "./screens/CommunityScreen";
// import { HabitEducationScreen } from "./screens/HabitEducationScreen";
// import { CoachChatScreen } from "./screens/CoachChatScreen";
// import { GrowthMapScreen } from "./screens/GrowthMapScreen";
// import { DisciplineScreen } from "./screens/DisciplineScreen";
// import { SymptomScreen } from "./screens/SymptomScreen";

// bottom navigation configuration
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "todos", label: "To-Dos", icon: ListTodo },
  { id: "habit-builder", label: "Habits", icon: Target },
  { id: "coach", label: "Coach", icon: MessageCircleHeart },
  { id: "more", label: "More", icon: MoreHorizontal },
];

// more menu categories configuration
const MORE_MENU_CATEGORIES = [
  {
    category: "Progress & Growth",
    items: [
      { id: "weekly-insights", label: "Weekly Insights", icon: Sparkles, description: "Mood, sleep & life area analytics" },
      { id: "growth-map", label: "Growth Map", icon: Flower2, description: "Visualize your holistic progress" },
      { id: "reflection", label: "Daily Reflection", icon: Heart, description: "End-of-day mindful check-in" },
      { id: "discipline-builder", label: "Discipline Builder", icon: Zap, description: "Build mental strength & resilience" },
      { id: "symptom-tracker", label: "Symptom Tracker", icon: Activity, description: "Track patterns & find correlations" },
    ],
  },
  {
    category: "Time & Focus",
    items: [
      { id: "timeflow", label: "Time Flow", icon: Clock, description: "Visual timeline & task scheduler" },
      { id: "focus-tools", label: "Focus Tools", icon: Timer, description: "Timers, breathing & deep work" },
      { id: "calendar", label: "Calendar", icon: Calendar, description: "View your schedule & events" },
    ],
  },
  {
    category: "Learning & Support",
    items: [
      { id: "habit-education", label: "Habit Education", icon: BookOpen, description: "Learn the psychology of habits" },
      { id: "coach-chat", label: "AI Coach Chat", icon: Sparkles, description: "Personal coaching conversation" },
      { id: "community", label: "Community", icon: Users, description: "Connect, share & support circles" },
    ],
  },
  {
    category: "Settings & Tools",
    items: [
      { id: "integrations", label: "Integrations", icon: Link2, description: "Connect health & calendar apps" },
      { id: "settings", label: "Settings", icon: Settings, description: "Customize your experience" },
    ],
  },
];

// main app content
function AppContent() {
  const { navigate, currentScreen } = useNavigation();
  const { hasSetMood, setMood } = useMoodCheck();
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);

  // sync stored config with theme and font settings
  useConfigSync();

  // redirect to check-in if mood not set
  useEffect(() => {
    if (!hasSetMood && currentScreen !== "checkin") {
      navigate("checkin");
    }
  }, [hasSetMood, currentScreen, navigate]);

  // handle screen navigation
  const handleNavigate = React.useCallback(
    (screenId: string) => {
      if (screenId === "more") {
        setShowMoreMenu(true);
      } else {
        navigate(screenId as any);
      }
    },
    [navigate]
  );

  // called when daily check-in completes
  const handleCheckInComplete = React.useCallback(
    (mood: string) => {
      setMood(mood);
      navigate("home");
    },
    [navigate, setMood]
  );

  // handle quick navigation to habit area
  const handleNavigateToHabits = React.useCallback(
    (lifeArea: string) => {
      navigate("habit-builder", { selectedArea: lifeArea });
    },
    [navigate]
  );

  // map legacy screen ids to current screens
  const screenMapping: Record<string, string> = {
    home: "home",
    checkin: "checkin",
    todos: "todos",
    "habit-builder": "habits",
    "habit-education": "education",
    coach: "coaching",
    "coach-chat": "coach-chat",
    "growth-map": "growth-map",
    reflection: "reflection",
    calendar: "calendar",
    "focus-tools": "focus",
    timeflow: "timeflow",
    "discipline-builder": "discipline",
    settings: "settings",
    integrations: "integrations",
    "symptom-tracker": "symptoms",
    community: "community",
    "weekly-insights": "weekly-insights",
  };

  const legacyScreen = screenMapping[currentScreen] || currentScreen;

  return (
      <div
        className="relative min-h-screen overflow-x-hidden transition-colors"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-card-foreground)",
        }}
      >
      <ScrollToTop screenKey={currentScreen} />

      {/* screen transitions */}
      <NavigationTransition screenKey={currentScreen} direction="up">
        {currentScreen === "checkin" && <CheckInScreen onComplete={handleCheckInComplete} />}
        {currentScreen === "home" && (
          <DashboardScreen onNavigateToHabits={handleNavigateToHabits} onNavigate={handleNavigate} />
        )}
        {currentScreen === "coach" && <CoachingScreen onNavigate={handleNavigate} />}
        {/* {currentScreen === "todos" && <TodosScreen />} */}
        {currentScreen === "focus-tools" && <FocusToolsScreen />}
        {/* {currentScreen === "timeflow" && <TimeFlowScreen />} */}
        {currentScreen === "reflection" && <ReflectionScreen />}
        {/* {currentScreen === "calendar" && <CalendarScreen />} */}
        {currentScreen === "settings" && <SettingsScreen onNavigate={handleNavigate} />}
        {currentScreen === "onboarding-layout" && <OnboardingWrapper editMode="layout" />}
        {currentScreen === "symptom-tracker" && <SymptomTrackerScreen onNavigate={handleNavigate} />}
        {currentScreen === "weekly-insights" && <WeeklyInsightsDashboard onNavigate={handleNavigate} />}
      </NavigationTransition>

      {/* bottom navigation bar */}
      {currentScreen !== "checkin" && (
        <AnimatedBottomNav
          navItems={NAV_ITEMS}
          currentScreen={legacyScreen}
          onNavigate={handleNavigate}
        />
      )}

      {/* more menu overlay */}
      <AnimatedMoreMenu
        isOpen={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        categories={MORE_MENU_CATEGORIES}
        currentScreen={legacyScreen}
        onNavigate={handleNavigate}
      />

      {/* in-app notifications */}
      <EnhancedNotificationDisplay />

      {/* toast system */}
      <Toaster
        position="bottom-center"
        duration={2000}
        toastOptions={{
          className: "gentle-nudge-toast",
          style: {
            marginBottom: "90px",
            background: "rgba(30, 41, 59, 0.95)",
            color: "white",
            border: "1px solid rgba(148, 163, 184, 0.2)",
          },
        }}
      />
    </div>
  );
}

// root wrapper with providers
export default function App() {
  useEffect(() => {
    migrateLocalStorage();
  }, []);

  return (
    <UserConfigProvider>
      <ThemeProvider>
        <NotificationProvider>
          <NavigationProvider persist initialScreen="home">
            <OnboardingWrapper>
              <AppContent />
            </OnboardingWrapper>
          </NavigationProvider>
        </NotificationProvider>
      </ThemeProvider>
    </UserConfigProvider>
  );
}
