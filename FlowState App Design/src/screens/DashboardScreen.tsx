// src/screens/DashboardScreen.tsx
// main dashboard overview screen — theme + dark mode aligned
import { useState, useEffect } from "react";
import {
  Smile,
  CheckCircle2,
  Flower2,
  Heart,
  Moon,
  Footprints,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useUserConfig } from "../config/UserConfigContext";
import { AdaptiveGreeting } from "../components/greeting/AdaptiveGreeting";
import { TimeOfDayIndicator } from "../components/indicator/TimeOfDayIndicator";
import { DailyMomentumRing } from "../components/DailyMomentumRing";
//import { WeatherMoonWidget } from "../components/widget/WeatherMoonWidget";
import { WeeklySummaryCard } from "../components/card/WeeklySummaryCard";
import { HealthWidget } from "../components/widget/HealthWidget";
import { LifeAreaCard } from "../components/card/LifeAreaCard";
import { AdaptiveRecommendationsWidget } from "../components/widget/AdaptiveRecommendationsWidget";
import { EncouragementMessage } from "../components/message/EncouragementMessage";
import { LifeAreaDialog } from "../components/dialogue/LifeAreaDialog";
import { getLocalStorageItem } from "../hooks/useLocalStorage";

interface DashboardScreenProps {
  onNavigateToHabits?: (lifeArea: string) => void;
  onNavigate?: (screen: string) => void;
}

interface Habit {
  id: string;
  name: string;
  lifeArea: string;
  frequency: string;
  timeSlots?: any[];
  completedSlots: { date: string; slotId?: string }[];
  isActive: boolean;
}

interface LifeArea {
  id: string;
  icon: string;
  title: string;
  progress: number;
  currentHabits: string[];
  suggestion: string;
  color: string;
}

const LIFE_AREA_CONFIG = [
  { id: "Health", icon: "❤️", title: "Health", suggestion: "Your body deserves gentle care", color: "#DCBBA3" },
  { id: "Work", icon: "💼", title: "Work", suggestion: "Progress over perfection", color: "#A3C9DC" },
  { id: "Self-Care", icon: "🧘", title: "Self-Care", suggestion: "You deserve this time", color: "#E9D5FF" },
  { id: "Relationships", icon: "💕", title: "Relationships", suggestion: "Connection nurtures the soul", color: "#DCADC9" },
  { id: "Personal Growth", icon: "🌱", title: "Personal Growth", suggestion: "Small steps lead to big growth", color: "#A3DCC9" },
  { id: "Home", icon: "🏡", title: "Environment", suggestion: "A calm space supports you", color: "#C9DCA3" },
  { id: "Creativity", icon: "🎨", title: "Creativity", suggestion: "Express yourself freely", color: "#DCA3BB" },
  { id: "Finances", icon: "💰", title: "Finances", suggestion: "Financial peace brings freedom", color: "#D4AF37" },
];

export function DashboardScreen({ onNavigateToHabits, onNavigate }: DashboardScreenProps = {}) {
  const { themeColors, darkMode } = useTheme();
  const { config } = useUserConfig();
  const [currentMood, setCurrentMood] = useState<string>("");
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [selectedLifeArea, setSelectedLifeArea] = useState<LifeArea | null>(null);

  useEffect(() => {
    const savedMood = getLocalStorageItem("flowstate-mood", "");
    if (savedMood) setCurrentMood(savedMood);

    const today = new Date().toDateString();
    const savedHabits = localStorage.getItem("flowstate-habits");
    const habits: Habit[] = savedHabits ? JSON.parse(savedHabits) : [];

    const calculatedAreas = LIFE_AREA_CONFIG.map((config) => {
      const areaHabits = habits.filter((h) => h.lifeArea === config.id && h.isActive);
      let completed = 0;
      const total = areaHabits.length;

      areaHabits.forEach((habit) => {
        if (habit.frequency === "multiple-daily" && habit.timeSlots) {
          const allSlotsCompleted = habit.timeSlots.every((slot) =>
            (habit.completedSlots || []).some(
              (c) => c.date === today && c.slotId === slot.id
            )
          );
          if (allSlotsCompleted) completed++;
        } else {
          const isCompleted = (habit.completedSlots || []).some((c) => c.date === today);
          if (isCompleted) completed++;
        }
      });

      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: config.id,
        icon: config.icon,
        title: config.title,
        progress,
        currentHabits: areaHabits.slice(0, 3).map((h) => h.name),
        suggestion: config.suggestion,
        color: config.color,
      };
    });

    setLifeAreas(calculatedAreas);
  }, []);

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case "low": return "low energy";
      case "moderate": return "moderate";
      case "good": return "good energy";
      default: return "not set";
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "low": return "😌";
      case "moderate": return "😊";
      case "good": return "🌟";
      default: return "💭";
    }
  };

  const handleDialogClose = () => setSelectedLifeArea(null);
  const dashboardLayout = config.dashboardLayout || [];

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "mood":
        return (
          <div className="flow-card">
            <div className="flex items-center gap-3 mb-3">
              <Smile size={20} style={{ color: themeColors.primary }} />
              <h3>Today's mood</h3>
            </div>
            <div className="text-sm opacity-70">
              {currentMood ? `${getMoodEmoji(currentMood)} ${getMoodLabel(currentMood)}` : "no check-in yet"}
            </div>
          </div>
        );

      case "momentum":
        return <DailyMomentumRing />;

      case "health":
        return (
          <div>
            <h2 className="mb-4">Health snapshot</h2>
            <div className="grid grid-cols-3 gap-4">
              <HealthWidget icon={<Moon size={20} />} label="sleep" value="7.5h" color="bg-blue-50 dark:bg-blue-900/40" />
              <HealthWidget icon={<Footprints size={20} />} label="steps" value="3,421" color="bg-peach-50 dark:bg-orange-900/40" />
              <HealthWidget icon={<Heart size={20} />} label="heart" value="68 bpm" color="bg-pink-50 dark:bg-pink-900/40" />
            </div>
          </div>
        );

      case "weekly":
        return <WeeklySummaryCard onViewDetails={() => onNavigate?.("weekly-insights")} />;

      case "todos":
        return (
          <div className="flow-card">
            <h2 className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={24} style={{ color: themeColors.primary }} />
              Today's to-dos
            </h2>
            <p className="text-sm opacity-70">Your to-do list goes here</p>
          </div>
        );

      case "habits":
        return (
          <div>
            <h2 className="mb-4">Life areas</h2>
            <p className="text-sm opacity-60 mb-4">Click a life area to view and manage habits</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lifeAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => (onNavigateToHabits ? onNavigateToHabits(area.id) : setSelectedLifeArea(area))}
                >
                  <LifeAreaCard {...area} />
                </button>
              ))}
            </div>
          </div>
        );

      case "aiInsights":
        return (
          <div className="flow-card">
            <p className="text-sm opacity-70">AI insights placeholder</p>
          </div>
        );

      case "reflection":
        return <EncouragementMessage />;

      case "adaptive":
        return <AdaptiveRecommendationsWidget />;

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen pb-24 relative overflow-hidden transition-colors"
      style={{
        background: darkMode
          ? `linear-gradient(180deg, #0b0d14 0%, #11131c 40%, #0d0f18 100%)`
          : `linear-gradient(to bottom, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      <div className="p-4 md:p-6 pt-8 md:pt-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <AdaptiveGreeting />
          </div>

          <div className="mb-6">
            <TimeOfDayIndicator />
          </div>

          {dashboardLayout.length > 0 ? (
            <div className="space-y-6">
              {dashboardLayout.map((widget) => (
                <div key={widget.id}>{renderWidget(widget.id)}</div>
              ))}
            </div>
          ) : (
            <div className="flow-card">
              <div className="mb-4 text-4xl">🌱</div>
              <h3 className="mb-2">Your dashboard is empty</h3>
              <p className="text-sm opacity-70 mb-6">Add widgets to personalize your dashboard</p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate("settings")}
                  className="px-6 py-3 rounded-2xl text-white shadow-md hover:shadow-lg transition-none"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Customize dashboard
                </button>
              )}
            </div>
          )}

          {onNavigate && (
            <div className="mt-8">
              <button
                onClick={() => onNavigate("growth-map")}
                className="rounded-3xl p-6 shadow-sm border-2 transition-all group relative overflow-hidden"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, #2b2550 0%, #1a1b28 100%)"
                    : `linear-gradient(135deg, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
                  borderColor: darkMode ? "rgba(255,255,255,0.1)" : themeColors.primaryLight,
                  boxShadow: darkMode
                    ? "0 0 20px -6px rgba(167,139,250,0.3)"
                    : "0 0 18px -6px rgba(251,191,36,0.25)",
                }}
              >
                {/* soft moving glow overlay for dark mode */}
                {darkMode && (
                  <div
                    className="absolute inset-0 opacity-20 blur-2xl animate-pulse"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(167,139,250,0.3), transparent 60%)",
                    }}
                  ></div>
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:opacity-80 transition-all"
                      style={{
                        backgroundColor: darkMode ? "#a78bfa" : themeColors.primary,
                        boxShadow: darkMode
                          ? "0 0 10px rgba(167,139,250,0.4)"
                          : "0 0 10px rgba(251,191,36,0.3)",
                      }}
                    >
                      <Flower2 size={28} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3
                        className="mb-1 font-medium"
                        style={{
                          color: darkMode ? "#f4f3ff" : themeColors.primaryDark,
                        }}
                      >
                        Explore your growth map
                      </h3>
                      <p
                        className="text-sm opacity-70"
                        style={{
                          color: darkMode ? "#b3b8d0" : "inherit",
                        }}
                      >
                        See your progress across all life areas
                      </p>
                    </div>
                  </div>
                  <TrendingUp
                    size={24}
                    style={{
                      color: darkMode ? "#c4b5fd" : themeColors.primaryDark,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedLifeArea && (
        <LifeAreaDialog
          isOpen={!!selectedLifeArea}
          onClose={handleDialogClose}
          lifeArea={selectedLifeArea}
        />
      )}
    </div>
  );
}
