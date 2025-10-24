// src/screens/HabitStackingScreen.tsx
// builds and manages habit stacks: chain multiple habits, reorder, add conditions, and save stacks locally

import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  Plus,
  GripVertical,
  X,
  Save,
  Sparkles,
  CloudRain,
  Clock,
  Lightbulb,
  CheckCircle2,
  Link2,
  AlertCircle,
} from "lucide-react";

interface StackedHabit {
  id: string;
  habitId?: string;
  name: string;
  order: number;
  isOptional: boolean;
}

interface Condition {
  id: string;
  type: "weather" | "energy" | "time" | "mood";
  condition: string;
  swapFromId: string;
  swapToId: string;
  swapToName: string;
}

interface HabitStack {
  id: string;
  name: string;
  lifeArea: string;
  habits: StackedHabit[];
  conditions: Condition[];
  suggestedTimeSlot: "morning" | "afternoon" | "evening" | "night";
  createdAt: string;
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning", emoji: "🌅", description: "6am - 12pm" },
  { id: "afternoon", label: "Afternoon", emoji: "☀️", description: "12pm - 5pm" },
  { id: "evening", label: "Evening", emoji: "🌆", description: "5pm - 9pm" },
  { id: "night", label: "Night", emoji: "🌙", description: "9pm - 12am" },
];

const LIFE_AREAS = [
  { id: "Health", emoji: "💚", label: "Health" },
  { id: "Work", emoji: "💼", label: "Work" },
  { id: "Personal", emoji: "🌸", label: "Personal" },
  { id: "Growth", emoji: "📘", label: "Growth" },
];

const STACKING_TIPS = [
  "Keep stacks tiny to start — 2-3 habits max",
  "Choose habits that naturally flow together",
  "Stack new habits onto existing strong ones",
  "Make it so easy you can’t say no",
  "Use physical locations as triggers",
  "The best stack is the one you’ll actually do",
];

export function HabitStackingScreen() {
  const { themeColors } = useTheme();
  const [stacks, setStacks] = useState<HabitStack[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [availableHabits, setAvailableHabits] = useState<any[]>([]);

  const [newStackName, setNewStackName] = useState("");
  const [selectedLifeArea, setSelectedLifeArea] = useState("Health");
  const [stackedHabits, setStackedHabits] = useState<StackedHabit[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("morning");
  const [showAddHabit, setShowAddHabit] = useState(false);
  //const [showAddCondition, setShowAddCondition] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const savedStacks = localStorage.getItem("flowstate-habit-stacks");
    if (savedStacks) setStacks(JSON.parse(savedStacks));

    const savedHabits = localStorage.getItem("flowstate-habits");
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits);
      setAvailableHabits(parsed.filter((h: any) => h.isActive));
    }

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % STACKING_TIPS.length);
    }, 8000);
    return () => clearInterval(tipInterval);
  }, []);

  const startNewStack = () => {
    setIsCreating(true);
    setNewStackName("");
    setStackedHabits([]);
    setConditions([]);
    setSelectedLifeArea("Health");
    setSelectedTimeSlot("morning");
  };

  const addHabitToStack = (habit: any) => {
    const newHabit: StackedHabit = {
      id: Date.now().toString(),
      habitId: habit.id,
      name: habit.name,
      order: stackedHabits.length,
      isOptional: false,
    };
    setStackedHabits((prev) => [...prev, newHabit]);
    setShowAddHabit(false);
  };

  const addCustomHabit = (name: string) => {
    if (!name.trim()) return;
    const newHabit: StackedHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      order: stackedHabits.length,
      isOptional: false,
    };
    setStackedHabits((prev) => [...prev, newHabit]);
  };

  const removeHabit = (id: string) => {
    setStackedHabits(stackedHabits.filter((h) => h.id !== id));
    setConditions(conditions.filter((c) => c.swapFromId !== id));
  };

  const toggleOptional = (id: string) => {
    setStackedHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, isOptional: !h.isOptional } : h
      )
    );
  };

  const saveStack = () => {
    if (!newStackName.trim() || stackedHabits.length < 2) return;
    const newStack: HabitStack = {
      id: Date.now().toString(),
      name: newStackName,
      lifeArea: selectedLifeArea,
      habits: stackedHabits,
      conditions,
      suggestedTimeSlot: selectedTimeSlot as any,
      createdAt: new Date().toISOString(),
    };
    const updated = [...stacks, newStack];
    setStacks(updated);
    localStorage.setItem("flowstate-habit-stacks", JSON.stringify(updated));
    setIsCreating(false);
  };

  const deleteStack = (id: string) => {
    const updated = stacks.filter((s) => s.id !== id);
    setStacks(updated);
    localStorage.setItem("flowstate-habit-stacks", JSON.stringify(updated));
  };

  return (
    <div
      className="min-h-screen p-6 pb-32 transition-colors"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link2 size={28} style={{ color: themeColors.primary }} />
          <h1>Habit Stacking</h1>
        </div>
        <p className="opacity-70 mb-6">
          Chain habits together for smoother, automatic routines.
        </p>

        {/* rotating tip */}
        <div
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3 transition-all"
          key={currentTip}
        >
          <Lightbulb size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">{STACKING_TIPS[currentTip]}</p>
        </div>

        {/* create new stack */}
        {!isCreating && (
          <button
            onClick={startNewStack}
            className="w-full bg-[var(--color-card)] rounded-3xl p-6 shadow-md mb-8 flex items-center justify-center gap-3 hover:shadow-lg border-2 border-dashed transition-all"
            style={{ borderColor: themeColors.primary }}
          >
            <Plus size={20} style={{ color: themeColors.primary }} />
            <span style={{ color: themeColors.primary }}>Create New Stack</span>
          </button>
        )}

        {/* stack builder */}
        {isCreating && (
          <div
            className="bg-[var(--color-card)] rounded-3xl shadow-lg p-6 mb-6 border"
            style={{ borderColor: themeColors.primary }}
          >
            <label className="block text-sm opacity-60 mb-2">Stack Name</label>
            <input
              type="text"
              value={newStackName}
              onChange={(e) => setNewStackName(e.target.value)}
              placeholder="e.g., Morning Energy Routine"
              className="w-full px-4 py-3 mb-6 rounded-2xl border focus:outline-none"
            />

            <label className="block text-sm opacity-60 mb-2">Life Area</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {LIFE_AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedLifeArea(a.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedLifeArea === a.id
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  style={
                    selectedLifeArea === a.id
                      ? { backgroundColor: themeColors.primary }
                      : {}
                  }
                >
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>

            {/* time slot */}
            <label className="block text-sm opacity-60 mb-2">
              <Clock size={14} className="inline mr-1" />
              Suggested Time
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot.id)}
                  className="p-3 rounded-2xl text-center border transition-all"
                  style={
                    selectedTimeSlot === slot.id
                      ? {
                          borderColor: themeColors.primary,
                          backgroundColor: `${themeColors.primary}10`,
                        }
                      : {}
                  }
                >
                  <div className="text-2xl mb-1">{slot.emoji}</div>
                  <div className="text-sm">{slot.label}</div>
                  <div className="text-xs opacity-60">{slot.description}</div>
                </button>
              ))}
            </div>

            {/* habit chain */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm opacity-60">
                  Your Habit Chain ({stackedHabits.length})
                </label>
                <button
                  onClick={() => setShowAddHabit(!showAddHabit)}
                  className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors"
                  style={{
                    backgroundColor: `${themeColors.primary}15`,
                    color: themeColors.primary,
                  }}
                >
                  <Plus size={16} />
                  Add Habit
                </button>
              </div>

              {showAddHabit && (
                <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
                  <input
                    type="text"
                    placeholder="Type a habit name..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm mb-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addCustomHabit(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  {availableHabits.length > 0 && (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {availableHabits.map((habit) => (
                        <button
                          key={habit.id}
                          onClick={() => addHabitToStack(habit)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 text-sm flex justify-between"
                        >
                          <span>{habit.name}</span>
                          <span className="opacity-60 text-xs">Add →</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {stackedHabits.length > 0 ? (
                <div className="space-y-2">
                  {stackedHabits.map((habit, idx) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-3 bg-[var(--color-card)] border rounded-xl p-3 shadow-sm"
                      style={{ borderColor: themeColors.primary }}
                    >
                      <GripVertical
                        size={18}
                        className="text-gray-400 cursor-grab"
                      />
                      <div
                        className="w-8 h-8 rounded-full grid place-items-center text-sm"
                        style={{
                          backgroundColor: themeColors.primary,
                          color: "#fff",
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-sm">{habit.name}</div>
                      <button
                        onClick={() => toggleOptional(habit.id)}
                        className="text-xs opacity-70 hover:opacity-100"
                      >
                        {habit.isOptional ? "Required" : "Optional"}
                      </button>
                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm opacity-60 bg-gray-50 rounded-xl">
                  Add habits to start your stack
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-2xl border hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveStack}
                className="flex-1 py-3 rounded-2xl text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: themeColors.primary }}
              >
                <Save size={18} />
                Save Stack
              </button>
            </div>
          </div>
        )}

        {/* existing stacks */}
        {stacks.length > 0 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 mb-2">
              <Sparkles size={20} style={{ color: themeColors.primary }} />
              Your Habit Stacks
            </h2>

            {stacks.map((stack) => (
              <div
                key={stack.id}
                className="bg-[var(--color-card)] rounded-3xl shadow-md p-6 border"
                style={{ borderColor: "var(--color-ring-offset-background)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3>{stack.name}</h3>
                    <p className="text-xs opacity-60">
                      {stack.lifeArea} •{" "}
                      {
                        TIME_SLOTS.find((t) => t.id === stack.suggestedTimeSlot)
                          ?.label
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => deleteStack(stack.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1 mb-3">
                  {stack.habits.map((h, i) => (
                    <div
                      key={h.id}
                      className="flex items-center gap-2 text-sm opacity-90"
                    >
                      <div
                        className="w-6 h-6 rounded-full grid place-items-center text-xs"
                        style={{
                          backgroundColor: `${themeColors.primary}25`,
                          color: themeColors.primary,
                        }}
                      >
                        {i + 1}
                      </div>
                      <span>{h.name}</span>
                      {h.isOptional && (
                        <span className="text-amber-600 text-xs ml-2">
                          (optional)
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {stack.conditions.length > 0 && (
                  <div className="mt-3 border-t pt-2 text-xs">
                    <p className="opacity-60 flex items-center gap-1 mb-1">
                      <AlertCircle size={12} /> Smart Swaps
                    </p>
                    {stack.conditions.map((c) => (
                      <div key={c.id} className="opacity-80">
                        <CloudRain size={10} className="inline mr-1" />
                        If {c.condition}: {c.swapToName}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="w-full mt-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: `${themeColors.primary}20`,
                    color: themeColors.primary,
                  }}
                >
                  <CheckCircle2 size={16} /> Start Stack
                </button>
              </div>
            ))}
          </div>
        )}

        {/* empty state */}
        {stacks.length === 0 && !isCreating && (
          <div className="text-center py-12 opacity-70">
            <div className="text-5xl mb-2">🔗</div>
            <h3>No habit stacks yet</h3>
            <p className="text-sm opacity-60">
              Create your first stack to chain habits together.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
