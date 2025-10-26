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
import { AdaptiveGreeting } from "../components/AdaptiveGreeting";
import { DailyMomentumRing } from "../components/DailyMomentumRing";
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
  { id: "Health", icon: "❤️", title: "Health", suggestion: "Your body deserves care", color: "#DCBBA3" },
  { id: "Work", icon: "💼", title: "Work", suggestion: "Progress over perfection", color: "#A3C9DC" },
  { id: "Self-Care", icon: "🧘", title: "Self-Care", suggestion: "You deserve this time", color: "#E9D5FF" },
  { id: "Relationships", icon: "💕", title: "Relationships", suggestion: "Connection nurtures the soul", color: "#DCADC9" },
  { id: "Personal Growth", icon: "🌱", title: "Personal Growth", suggestion: "Small steps lead to big growth", color: "#A3DCC9" },
  { id: "Home", icon: "🏡", title: "Environment", suggestion: "A calm space supports you", color: "#C9DCA3" },
  { id: "Creativity", icon: "🎨", title: "Creativity", suggestion: "Express yourself freely", color: "#DCA3BB" },
  { id: "Finances", icon: "💰", title: "Finances", suggestion: "Financial peace brings freedom", color: "#D4AF37" },
];

const WIDGET_SIZES: Record<string, "small" | "medium" | "large"> = {
  mood: "small",
  momentum: "small",
  todos: "small",
  health: "medium",
  weekly: "medium",
  habits: "large",
  aiInsights: "medium",
  reflection: "medium",
  adaptive: "medium",
};

export function DashboardScreen({ onNavigateToHabits, onNavigate }: DashboardScreenProps = {}) {
  const { themeColors, darkMode } = useTheme();
  const { config } = useUserConfig();
  const [currentMood, setCurrentMood] = useState<string>("");
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [selectedLifeArea, setSelectedLifeArea] = useState<LifeArea | null>(null);
  const [todos, setTodos] = useState<any[]>([]);

  // load saved todos once
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("flowstate-todos") || "[]");
    setTodos(savedTodos);
  }, []);

  const toggleTodo = (index: number) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    localStorage.setItem("flowstate-todos", JSON.stringify(updated));
    setTodos(updated);
  };

  // mood + life area calculations
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
      case "low": return "Low energy";
      case "moderate": return "Moderate";
      case "good": return "Good energy";
      default: return "Not set";
    }
  };

  const handleDialogClose = () => setSelectedLifeArea(null);
  const dashboardLayout = config.dashboardLayout || [];

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      // case "mood":
      //   return (
      //     <div
      //       className="flow-card flex items-center justify-between p-3 rounded-2xl"
      //       style={{
      //         minHeight: "64px",
      //         background: darkMode
      //           ? "linear-gradient(135deg, #1a1b28, #2b2550)"
      //           : "linear-gradient(135deg, #f4f2ff, #ede9fe)",
      //         boxShadow: darkMode
      //           ? "0 0 10px rgba(167,139,250,0.15)"
      //           : "0 0 10px rgba(167,139,250,0.1)",
      //       }}
      //     >
      //       <div className="flex items-center gap-2 text-sm font-medium">
      //         <Smile size={18} style={{ color: themeColors.primary }} />
      //         <span className="opacity-80">
      //           Mood : 
      //           <span className="ml-1 font-semibold opacity-100">
      //             {currentMood
      //               ? ` ${getMoodLabel(currentMood)}`
      //               : " —"}
      //           </span>
      //         </span>
      //       </div>
      //     </div>
      //   );

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
        const activeTodos = todos.filter((t) => !t.completed).slice(0, 6);

        return (
          <div className="flow-card p-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 size={18} style={{ color: themeColors.primary }} />
              Today's To-Dos
            </h2>

            {activeTodos.length > 0 ? (
              <ul className="text-sm grid grid-cols-2">
                {activeTodos.map((todo: any, index: number) => (
                  <li
                    key={index}
                    onClick={() => {
                      // toggle and immediately remove from dashboard view
                      const allTodos = [...todos];
                      const todoIndex = todos.findIndex((t) => t.id === todo.id);
                      if (todoIndex !== -1) {
                        allTodos[todoIndex].completed = !allTodos[todoIndex].completed;
                        localStorage.setItem("flowstate-todos", JSON.stringify(allTodos));
                        setTodos(allTodos.filter((t) => !t.completed));
                      }
                    }}
                    className="flex flex-col rounded-lg border border-[var(--color-input)] hover:bg-[var(--color-accent)] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 py-0.5">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          const allTodos = [...todos];
                          const todoIndex = todos.findIndex((t) => t.id === todo.id);
                          if (todoIndex !== -1) {
                            allTodos[todoIndex].completed = !allTodos[todoIndex].completed;
                            localStorage.setItem("flowstate-todos", JSON.stringify(allTodos));
                            setTodos(allTodos.filter((t) => !t.completed));
                          }
                        }}
                        className="w-3 h-3 flex-shrink-0 rounded-full border border-[var(--color-ring)] hover:scale-110 transition-all"
                      />
                      <span className="flex-1 truncate text-[0.9rem] font-sm">
                        {todo.title}
                      </span>
                    </div>

                    {todo.lifeArea && (
                      <span className="ml-6 mb-1 text-[0.7rem] opacity-60 tracking-wide">
                        {todo.lifeArea}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs opacity-60 italic">No to-dos for today ✨</p>
            )}
          </div>
        );

      case "habits":
        return (
          <div>
            <h2 className="mb-4">Life areas</h2>
            <p className="text-sm opacity-60 mb-4">Click a life area to view and manage habits</p>
            <div className="grid grid-cols-2 gap-2">
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
        return <div className="flow-card"><p className="text-sm opacity-70">AI insights placeholder</p></div>;

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
        ? `linear-gradient(
            180deg,
            var(--color-background) 0%,
            #1a1b28 25%,
            #201d3d 55%,
            #14122a 85%,
            #0d0f18 100%
          )`
        : `linear-gradient(
            180deg,
            var(--color-background) 0%,
            #ede9fe 100%,
            #e3dcff 80%,
            #dcd4ff 50%,
            #f3f2ff 20%
          )`,
      }}
    >
      <div className="p-4 md:p-6 pt-8 md:pt-12 relative z-10">
        <div className="max-w-6xl mx-auto">

          <div className="mb-6">
            <AdaptiveGreeting />
          </div>

          {/* <div className="w-full flex justify-center my-2">
            <span
              style={{
                color: darkMode ? "#a78bfa" : "#6d28d9",
                fontSize: "0.1rem",
                lineHeight: "0.5rem",
              }}
            >
              •
            </span>
          </div> */}

          {dashboardLayout.length > 0 ? (
            <div className="grid gap-2">
              {dashboardLayout.map((widget) => {
                const size = WIDGET_SIZES[widget.id] || "medium";
                const colSpan =
                  size === "large"
                    ? "sm:col-span-2 lg:col-span-3"
                    : size === "medium"
                    ? "sm:col-span-2"
                    : "col-span-1";
                return (
                  <div key={widget.id} className={`relative ${colSpan}`}>
                    {renderWidget(widget.id)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flow-card text-center p-6">
              <div className="mb-4 text-4xl">🌱</div>
              <h3 className="mb-2">Your dashboard is empty</h3>
              <p className="text-sm opacity-70 mb-6">
                Add widgets to personalize your dashboard
              </p>
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

          <div className="w-full flex justify-center my-6">
            <span
              style={{
                color: darkMode ? "#a78bfa" : "#6d28d9",
                fontSize: "0.1rem",
                lineHeight: "1rem",
              }}
            >
              •
            </span>
          </div>

          {onNavigate && (
            <div className="mt-8">
              <button
                onClick={() => onNavigate("growth-map")}
                className="rounded-3xl p-2 w-full shadow-sm border-2 transition-all group relative overflow-hidden"
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
                <div className="relative flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-2xl flex items-center justify-center group-hover:opacity-80 transition-all"
                      style={{
                        backgroundColor: darkMode ? "#a78bfa" : themeColors.primary,
                        boxShadow: darkMode
                          ? "0 0 10px rgba(167,139,250,0.4)"
                          : "0 0 10px rgba(251,191,36,0.3)",
                      }}
                    >
                      <Flower2 size={14} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3
                        className="mb-1 font-sm"
                        style={{
                          color: darkMode ? "#f4f3ff" : themeColors.primaryDark,
                        }}
                      >
                        Explore your growth map
                      </h3>
                      <p
                        className="text-xs opacity-50"
                        style={{
                          color: darkMode ? "#b3b8d0" : "inherit",
                        }}
                      >
                        See your progress across all life areas
                      </p>
                    </div>
                  </div>
                  <TrendingUp
                    size={12}
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
