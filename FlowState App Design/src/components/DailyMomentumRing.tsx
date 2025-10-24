// DailyMomentumRing.tsx

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Flame } from "lucide-react";

interface MomentumData {
  habitsCompleted: number;
  totalHabits: number;
  todosCompleted: number;
  totalTodos: number;
  todayCheckIns: number;
  totalCheckIns: number;
  percentage: number;
  motivationLevel: "low" | "building" | "strong" | "unstoppable";
}

export function DailyMomentumRing() {
  const [momentum, setMomentum] = useState<MomentumData>({
    habitsCompleted: 0,
    totalHabits: 0,
    todosCompleted: 0,
    totalTodos: 0,
    todayCheckIns: 0,
    totalCheckIns: 3,
    percentage: 0,
    motivationLevel: "low",
  });

  useEffect(() => {
    calculateMomentum();

    const handleUpdate = () => {
      console.log("🔄 flowstate-update received — recalculating momentum");
      calculateMomentum();
    };

    window.addEventListener("flowstate-update", handleUpdate);
    return () => window.removeEventListener("flowstate-update", handleUpdate);
  }, []);

  const calculateMomentum = () => {
    const today = new Date().toISOString().split("T")[0];

    // habits
    const savedHabits = localStorage.getItem("flowstate-habits");
    const habits = savedHabits ? JSON.parse(savedHabits) : [];
    const activeHabits = habits.filter((h: any) => h.isActive);
    const totalHabits = activeHabits.length;

    let habitsCompleted = 0;
    activeHabits.forEach((habit: any) => {
      if (habit.frequency === "multiple-daily" && habit.timeSlots) {
        const allSlotsCompleted = habit.timeSlots.every((slot: any) =>
          (habit.completedSlots || []).some(
            (c: any) => c.date === today && c.slotId === slot.id
          )
        );
        if (allSlotsCompleted) habitsCompleted++;
      } else {
        const isCompleted = (habit.completedSlots || []).some(
          (c: any) => c.date === today
        );
        if (isCompleted) habitsCompleted++;
      }
    });

    // to-dos
    const savedTodos = localStorage.getItem("flowstate-todos");
    const todos = savedTodos ? JSON.parse(savedTodos) : [];
    const todosCompleted = todos.filter((t: any) => t.completed).length;
    const totalTodos = todos.length;

    // check-ins
    let checkIns = 0;
    const moodDate = (localStorage.getItem("flowstate-mood-date") || "")
      .replace(/['"]/g, "")
      .trim();
    const energyDate = (localStorage.getItem("flowstate-energy-date") || "")
      .replace(/['"]/g, "")
      .trim();
    const coachingDate = (localStorage.getItem("flowstate-coaching-date") || "")
      .replace(/['"]/g, "")
      .trim();

    if (moodDate === today) checkIns++;
    if (energyDate === today) checkIns++;
    if (coachingDate === today) checkIns++;

    // totals
    const completed = habitsCompleted + todosCompleted + checkIns;
    const total = totalHabits + totalTodos + 3;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    let motivationLevel: MomentumData["motivationLevel"] = "low";
    if (percentage >= 80) motivationLevel = "unstoppable";
    else if (percentage >= 50) motivationLevel = "strong";
    else if (percentage >= 20) motivationLevel = "building";

    console.log("🧩 Momentum breakdown:", {
      habitsCompleted,
      totalHabits,
      todosCompleted,
      totalTodos,
      checkIns,
      percentage,
    });

    setMomentum({
      habitsCompleted,
      totalHabits,
      todosCompleted,
      totalTodos,
      todayCheckIns: checkIns,
      totalCheckIns: 3,
      percentage,
      motivationLevel,
    });
  };

  // ui helpers
  const getMotivationMessage = () => {
    switch (momentum.motivationLevel) {
      case "unstoppable":
        return "Unstoppable! 🔥";
      case "strong":
        return "Strong momentum 💪";
      case "building":
        return "Building up ✨";
      default:
        return "Just getting started 🌱";
    }
  };

  const getMotivationColor = () => {
    switch (momentum.motivationLevel) {
      case "unstoppable":
        return "#F59E0B";
      case "building":
        return "#8B5CF6";
      default:
        return "#D1D5DB";
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset =
    circumference - (momentum.percentage / 100) * circumference;

  // render
  return (
    <div className="bg-[var(--color-card)] rounded-3xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="opacity-60 text-sm mb-1">Today's Momentum</h3>
          <div className="opacity-80">{getMotivationMessage()}</div>
        </div>
        <Flame
          size={24}
          style={{ color: getMotivationColor() }}
          className="opacity-80"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* RING */}
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={getMotivationColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{
                duration: 1.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl" style={{ color: getMotivationColor() }}>
              {momentum.percentage}%
            </div>
            <div className="text-xs opacity-60 mt-1">complete</div>
          </div>
        </div>

        {/* STATS */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-lg">
              💪
            </div>
            <div>
              <div className="text-xs opacity-60">Habits</div>
              <div className="text-sm">
                {momentum.habitsCompleted}/{momentum.totalHabits}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 text-lg">
              📝
            </div>
            <div>
              <div className="text-xs opacity-60">To-Dos</div>
              <div className="text-sm">
                {momentum.todosCompleted}/{momentum.totalTodos}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">
              💬
            </div>
            <div>
              <div className="text-xs opacity-60">Check-ins</div>
              <div className="text-sm">
                {momentum.todayCheckIns}/{momentum.totalCheckIns}
              </div>
            </div>
          </div>
        </div>
      </div>

      {momentum.percentage < 30 && momentum.totalTodos + momentum.totalHabits > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--color-ring-offset-background)]">
          <p className="text-xs opacity-60 text-center">
            Small steps create big momentum ✨
          </p>
        </div>
      )}
    </div>
  );
}
