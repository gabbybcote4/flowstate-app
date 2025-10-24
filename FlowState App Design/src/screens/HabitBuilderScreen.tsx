// src/screens/HabitBuilderScreen.tsx
// live habit builder screen: add/edit/delete habits, template picker, consistency math, simple animations, and theme integration (no external motion/toast deps)

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Target,
  X,
  Calendar,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Settings,
  Trash2,
  Link2,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";

// types
type Energy = "low" | "medium" | "high";
type Frequency =
  | "daily"
  | "multiple-daily"
  | "weekdays"
  | "3x-week"
  | "weekly"
  | "as-needed";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface TimeSlot {
  id: string;
  time: TimeOfDay;
  label: string;
}

interface Habit {
  id: string;
  name: string;
  purpose: string;
  frequency: Frequency;
  timeSlots?: TimeSlot[];
  trigger: string;
  motivation: string;
  lifeArea: string;
  streak: number;
  completedSlots: { date: string; slotId?: string }[];
  isActive: boolean;
}

interface HabitTemplate {
  id: string;
  name: string;
  purpose: string;
  frequency: Frequency;
  timeSlots?: TimeSlot[];
  trigger: string;
  motivation: string;
  lifeArea: string;
  energyLevel?: Energy;
}

interface HabitBuilderScreenProps {
  initialSelectedArea?: string;
}

// constants
const LIFE_AREAS = [
  "All",
  "Health",
  "Work",
  "Relationships",
  "Personal Growth",
  "Creativity",
  "Home",
] as const;

const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: "ht1",
    name: "Morning Run",
    purpose: "build cardiovascular health and start the day energized",
    frequency: "daily",
    trigger: "after waking up",
    motivation: "feel strong and energetic",
    lifeArea: "Health",
    energyLevel: "high",
  },
  {
    id: "ht2",
    name: "Hydration Check",
    purpose: "stay properly hydrated throughout the day",
    frequency: "multiple-daily",
    timeSlots: [
      { id: "s1", time: "morning", label: "Morning" },
      { id: "s2", time: "afternoon", label: "Afternoon" },
      { id: "s3", time: "evening", label: "Evening" },
    ],
    trigger: "set phone reminders",
    motivation: "better energy and focus",
    lifeArea: "Health",
    energyLevel: "low",
  },
  {
    id: "ht3",
    name: "Weekly Review",
    purpose: "reflect on progress and plan ahead",
    frequency: "weekly",
    trigger: "friday afternoon",
    motivation: "continuous improvement",
    lifeArea: "Work",
    energyLevel: "medium",
  },
  {
    id: "ht4",
    name: "Evening Walk",
    purpose: "light exercise and stress relief",
    frequency: "daily",
    trigger: "after dinner",
    motivation: "clear mind and better sleep",
    lifeArea: "Health",
    energyLevel: "medium",
  },
  {
    id: "ht5",
    name: "Journal Writing",
    purpose: "process thoughts and emotions",
    frequency: "daily",
    trigger: "before bed",
    motivation: "self-understanding",
    lifeArea: "Personal Growth",
    energyLevel: "medium",
  },
];

// helpers
function getFrequencyLabel(f: Frequency): string {
  switch (f) {
    case "daily":
      return "Daily";
    case "multiple-daily":
      return "Multiple/day";
    case "weekly":
      return "Weekly";
    case "3x-week":
      return "3×/week";
    case "as-needed":
      return "As needed";
    default:
      return f;
  }
}

function calculateConsistencyScore(habit: Habit): number {
  const daysToCheck = 30;
  const dateStrings = Array.from({ length: daysToCheck }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  });

  if (habit.frequency === "multiple-daily" && habit.timeSlots?.length) {
    let totalRequired = daysToCheck * habit.timeSlots.length;
    let totalCompleted = 0;
    dateStrings.forEach((dateStr) => {
      const completedCount = (habit.completedSlots || []).filter(
        (s) => s.date === dateStr
      ).length;
      totalCompleted += completedCount;
    });
    return totalRequired > 0
      ? Math.round((totalCompleted / totalRequired) * 100)
      : 0;
  }

  const completedDates = new Set(
    (habit.completedSlots || []).map((s) => s.date)
  );
  if (habit.frequency === "daily") {
    const completedCount = dateStrings.filter((d) => completedDates.has(d))
      .length;
    return Math.round((completedCount / daysToCheck) * 100);
  }
  if (habit.frequency === "weekly" || habit.frequency === "3x-week") {
    const completedCount = dateStrings.filter((d) => completedDates.has(d))
      .length;
    const expected = habit.frequency === "weekly" ? 4 : 12;
    return Math.max(0, Math.min(100, Math.round((completedCount / expected) * 100)));
  }

  const completedCount = dateStrings.filter((d) => completedDates.has(d))
    .length;
  return Math.min(100, completedCount * 3);
}

function encouragement(consistency: number, daysCompleted: number): string {
  if (consistency === 0 && daysCompleted === 0)
    return "ready to start? every journey begins with a single step";
  if (consistency < 20)
    return `you showed up ${daysCompleted} ${
      daysCompleted === 1 ? "day" : "days"
    } — every attempt matters`;
  if (consistency < 40)
    return `${consistency}% consistency — you’re building momentum`;
  if (consistency < 60)
    return `${consistency}% consistency — you’re creating real change`;
  if (consistency < 80)
    return `${consistency}% consistency — this is becoming part of you`;
  return `${consistency}% consistency — you’re absolutely cruising`;
}

// small visual: momentum ring using plain svg
function MomentumRing({
  percentage,
  size = 72,
  strokeWidth = 5,
  track = "#f3e8ff",
  color = "#a78bfa",
  children,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  track?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (dash / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

// main screen
export function HabitBuilderScreen({ initialSelectedArea }: HabitBuilderScreenProps = {}) {
  const { themeColors } = useTheme();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>(
    initialSelectedArea || "All"
  );
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<string>("All");
  const [selectedEnergyLevel, setSelectedEnergyLevel] =
    useState<string>("All");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("flowstate-habits");
    if (saved) {
      try {
        const parsed: Habit[] = JSON.parse(saved);
        setHabits(parsed);
      } catch {
        setHabits([]);
      }
    }
    const savedHide = localStorage.getItem("flowstate-habits-hide-completed");
    if (savedHide) setHideCompleted(savedHide === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("flowstate-habits", JSON.stringify(habits));
  }, [habits]);

  const filteredHabits = useMemo(
    () =>
      habits.filter(
        (h) => selectedArea === "All" || h.lifeArea === selectedArea
      ),
    [habits, selectedArea]
  );

  const availableTemplates = useMemo(() => {
    return HABIT_TEMPLATES.filter((t) => {
      const energyOk =
        selectedEnergyLevel === "All" ||
        t.energyLevel === selectedEnergyLevel.toLowerCase();
      const areaOk = templateFilter === "All" || t.lifeArea === templateFilter;
      return energyOk && areaOk;
    });
  }, [templateFilter, selectedEnergyLevel]);

  // functions
  const addHabitFromTemplate = (t: HabitTemplate) => {
    const newHabit: Habit = {
      id: String(Date.now()),
      name: t.name,
      purpose: t.purpose,
      frequency: t.frequency,
      timeSlots: t.timeSlots,
      trigger: t.trigger,
      motivation: t.motivation,
      lifeArea: t.lifeArea,
      streak: 0,
      completedSlots: [],
      isActive: true,
    };
    setHabits((prev) => [...prev, newHabit]);
    setShowTemplates(false);
  };

  const updateHabit = (updated: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabitComplete = (habitId: string, slotId?: string) => {
    const today = new Date().toDateString();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const next = { ...h, completedSlots: [...(h.completedSlots || [])] };
        const idx = next.completedSlots.findIndex(
          (s) => s.date === today && (slotId ? s.slotId === slotId : !s.slotId)
        );
        if (idx >= 0) next.completedSlots.splice(idx, 1);
        else next.completedSlots.push({ date: today, ...(slotId ? { slotId } : {}) });
        return next;
      })
    );
  };

  const completedToday = (h: Habit) => {
    const today = new Date().toDateString();
    if (h.frequency === "multiple-daily" && h.timeSlots?.length) {
      return h.timeSlots.every((slot) =>
        (h.completedSlots || []).some(
          (s) => s.date === today && s.slotId === slot.id
        )
      );
    }
    return (h.completedSlots || []).some((s) => s.date === today);
  };

  const visibleHabits = useMemo(() => {
    const today = new Date().toDateString();
    return filteredHabits
      .filter((h) => {
        if (!hideCompleted) return true;
        return !(h.completedSlots || []).some((s) => s.date === today);
      })
      .sort((a, b) => {
        const aDone = completedToday(a);
        const bDone = completedToday(b);
        return aDone === bDone ? 0 : aDone ? 1 : -1;
      });
  }, [filteredHabits, hideCompleted]);

  const cardBg = "var(--color-card)";
  const cardFg = "var(--color-card-foreground)";
  const borderCol = "var(--color-ring-offset-background)";

  return (
    <div
      className="min-h-screen transition-colors"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* header */}
      <div
        className="sticky top-0 z-40 flow-card"
        style={{ borderColor: borderCol }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 py-3">
            <button
              className="flex-1 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: themeColors.primary }}
            >
              <Target size={18} />
              my habits
            </button>
            <button
              className="flex-1 py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: "transparent", color: "#6B7280" }}
              disabled
            >
              <Link2 size={18} />
              habit stacking
            </button>
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="mb-1" style={{ color: cardFg }}>
                habit garden
              </h2>
              <p className="text-sm opacity-70">
                {habits.length} habits growing
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2.5 rounded-xl text-sm shadow-md"
                style={{ backgroundColor: themeColors.primary, color: "#fff" }}
              >
                <Plus size={16} className="inline mr-1" />
                add habit
              </button>
              {habits.length > 0 && (
                <button
                  onClick={() => {
                    const v = !hideCompleted;
                    setHideCompleted(v);
                    localStorage.setItem(
                      "flowstate-habits-hide-completed",
                      String(v)
                    );
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm border"
                  style={{
                    backgroundColor: hideCompleted
                      ? themeColors.primary
                      : "var(--color-card)",
                    color: hideCompleted ? "#fff" : themeColors.primary,
                    borderColor: hideCompleted
                      ? themeColors.primary
                      : borderCol,
                  }}
                >
                  {hideCompleted ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
                  {hideCompleted ? "show" : "hide"} done
                </button>
              )}
            </div>
          </div>

          {/* area filter */}
          <div className="mb-4 -mx-4 md:-mx-6">
            <div className="overflow-x-auto px-4 md:px-6 pb-2 scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {LIFE_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                      selectedArea === area
                        ? "text-white shadow-md"
                        : "flow-card"
                    }`}
                    style={
                      selectedArea === area
                        ? { backgroundColor: themeColors.primary }
                        : {}
                    }
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* empty state */}
          {habits.length === 0 && (
            <div
              className="rounded-3xl p-8 text-center shadow-lg"
              style={{ backgroundColor: cardBg, color: cardFg }}
            >
              <Target size={48} className="mx-auto mb-3 opacity-30" />
              <h3 className="mb-2">plant your first habit</h3>
              <p className="text-sm mb-6 opacity-70">
                turn your goals into gentle routines or choose a template
              </p>
              <button
                onClick={() => setShowTemplates(true)}
                className="px-6 py-3 rounded-xl text-white shadow-lg"
                style={{ backgroundColor: themeColors.primary }}
              >
                <Plus size={18} /> browse templates
              </button>
            </div>
          )}

          {/* habit list */}
          <div className="space-y-4">
            {visibleHabits.map((habit) => {
              //const today = new Date().toDateString();
              const cons = calculateConsistencyScore(habit);
              const daysCompleted = new Set(
                (habit.completedSlots || []).map((s) => s.date)
              ).size;
              const msg = encouragement(cons, daysCompleted);
              const isDone = completedToday(habit);

              return (
                <div
                  key={habit.id}
                  className="rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all"
                  style={{
                    backgroundColor: cardBg,
                    color: cardFg,
                    border: `1px solid ${borderCol}`,
                  }}
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <MomentumRing
                        percentage={cons}
                        size={100}
                        strokeWidth={6}
                        color={themeColors.primary}
                        track={`${themeColors.primary}22`}
                      >
                        <div className="text-xs opacity-80">{cons}%</div>
                      </MomentumRing>
                    </div>

                    {/* middle info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="mb-1">{habit.name}</h3>
                          <p
                            className="text-sm mb-3"
                            style={{ color: themeColors.primary }}
                          >
                            {habit.purpose}
                          </p>
                        </div>

                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => {
                              setEditingHabit(habit);
                              setShowTemplates(true);
                            }}
                            className="p-2 hover:bg-[var(--color-accent)] rounded-lg transition-colors"
                            title="edit habit"
                          >
                            <Settings size={16} className="opacity-70" />
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                            title="delete habit"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div
                          className="px-3 py-1.5 rounded-full text-sm"
                          style={{
                            backgroundColor: `${themeColors.primary}15`,
                            color: themeColors.primary,
                          }}
                        >
                          {cons}% consistency
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          <Calendar size={12} />
                          <span>{getFrequencyLabel(habit.frequency)}</span>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: `${themeColors.primary}10`,
                            color: themeColors.primary,
                          }}
                        >
                          {habit.lifeArea}
                        </span>
                      </div>

                      <div
                        className="px-4 py-2.5 rounded-xl text-sm flex items-start gap-2"
                        style={{ backgroundColor: "rgba(254,243,242,0.8)" }}
                      >
                        <Sparkles
                          size={16}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: "#f97066" }}
                        />
                        <span className="opacity-80">{msg}</span>
                      </div>
                    </div>

                    {/* right side completion button */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <button
                        onClick={() => toggleHabitComplete(habit.id)}
                        className="relative"
                        title="mark complete"
                      >
                        <MomentumRing
                          percentage={isDone ? 100 : 0}
                          size={72}
                          strokeWidth={5}
                          color={themeColors.primary}
                          track={`${themeColors.primary}22`}
                        >
                          <div
                            className={`w-14 h-14 rounded-full grid place-items-center transition-all ${
                              isDone ? "text-white" : ""
                            }`}
                            style={
                              isDone
                                ? { backgroundColor: "#22c55e" }
                                : {
                                    border: `2px solid ${themeColors.primary}`,
                                    color: themeColors.primary,
                                    background: "transparent",
                                  }
                            }
                          >
                            {isDone ? (
                              <Check size={24} strokeWidth={3} />
                            ) : (
                              <CheckCircle2 size={28} />
                            )}
                          </div>
                        </MomentumRing>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* floating add button */}
          <button
            onClick={() => {
              setEditingHabit(null);
              setShowTemplates(true);
            }}
            className="fixed bottom-24 right-6 w-16 h-16 rounded-full text-white shadow-2xl grid place-items-center"
            style={{
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryDark})`,
            }}
            title="add habit"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* modal section (template or edit habit) */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div
            className="rounded-3xl max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col shadow-xl"
            style={{
              backgroundColor: cardBg,
              color: cardFg,
              border: `1px solid ${borderCol}`,
            }}
          >
            <div
              className="p-6 border-b flex items-center justify-between"
              style={{ borderColor: borderCol }}
            >
              <div>
                <h2>{editingHabit ? "edit habit" : "habit templates"}</h2>
                <p className="text-sm opacity-70 mt-1">
                  {editingHabit
                    ? "customize your habit"
                    : "choose a template or create your own"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTemplates(false);
                  setEditingHabit(null);
                }}
                className="p-2 hover:bg-[var(--color-accent)] rounded-full transition-colors"
                title="close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {editingHabit ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">habit name</label>
                    <input
                      type="text"
                      value={editingHabit.name}
                      onChange={(e) =>
                        setEditingHabit({
                          ...editingHabit,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      purpose / why it matters
                    </label>
                    <textarea
                      value={editingHabit.purpose}
                      onChange={(e) =>
                        setEditingHabit({
                          ...editingHabit,
                          purpose: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none resize-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">life area</label>
                    <div className="grid grid-cols-2 gap-2">
                      {LIFE_AREAS.filter((a) => a !== "All").map((area) => (
                        <button
                          key={area}
                          onClick={() =>
                            setEditingHabit({
                              ...editingHabit,
                              lifeArea: area,
                            })
                          }
                          className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                            editingHabit.lifeArea === area
                              ? "text-white shadow-md"
                              : ""
                          }`}
                          style={
                            editingHabit.lifeArea === area
                              ? { backgroundColor: themeColors.primary }
                              : { backgroundColor: "var(--color-accent)" }
                          }
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        if (editingHabit) updateHabit(editingHabit);
                        setShowTemplates(false);
                        setEditingHabit(null);
                      }}
                      className="flex-1 px-6 py-3 rounded-xl text-white shadow-md"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      save changes
                    </button>
                    <button
                      onClick={() => {
                        setShowTemplates(false);
                        setEditingHabit(null);
                      }}
                      className="px-6 py-3 rounded-xl"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-2 border-b" style={{ borderColor: borderCol }}>
                    {["All", "High", "Medium", "Low"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedEnergyLevel(level)}
                        className={`px-4 py-2 transition-all ${
                          selectedEnergyLevel === level
                            ? "border-b-2 -mb-px"
                            : "opacity-60 hover:opacity-90"
                        }`}
                        style={
                          selectedEnergyLevel === level
                            ? {
                                borderColor: themeColors.primary,
                                color: themeColors.primary,
                              }
                            : {}
                        }
                      >
                        {level.toLowerCase()} energy
                      </button>
                    ))}
                  </div>

                  <div className="-mx-6">
                    <div className="overflow-x-auto px-6 pb-2 scrollbar-hide">
                      <div className="flex gap-2 min-w-max">
                        {LIFE_AREAS.map((area) => (
                          <button
                            key={area}
                            onClick={() => setTemplateFilter(area)}
                            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                              templateFilter === area
                                ? "text-white shadow-md"
                                : ""
                            }`}
                            style={
                              templateFilter === area
                                ? { backgroundColor: themeColors.primary }
                                : { backgroundColor: "var(--color-accent)" }
                            }
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {availableTemplates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => addHabitFromTemplate(t)}
                        className="text-left p-4 rounded-xl border hover:shadow-md transition-all"
                        style={{ borderColor: borderCol, backgroundColor: cardBg }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4>{t.name}</h4>
                          <div
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{
                              backgroundColor: `${themeColors.primary}16`,
                              color: themeColors.primary,
                            }}
                          >
                            {t.lifeArea}
                          </div>
                        </div>
                        <p className="text-xs opacity-70 mb-2">{t.purpose}</p>
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          <Calendar size={12} />
                          <span>{getFrequencyLabel(t.frequency)}</span>
                          {t.energyLevel && (
                            <>
                              <span>•</span>
                              <span>{t.energyLevel} energy</span>
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                    {availableTemplates.length === 0 && (
                      <div className="text-sm opacity-60">
                        no templates match your filters
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
