// src/components/DailyMomentumRing.tsx
// daily momentum ring component showing user's progress
import React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Daily Momentum</h3>
        <div className="flex items-center gap-2 text-xs opacity-70">
          <Flame
            size={18}
            style={{ color: getMotivationColor() }}
            className="opacity-80"
          />
          {getMotivationMessage()}
        </div>
      </div>

      <div className="flex items-center gap-4">

        {/* compact ring */}
        <div className="relative w-[80px] h-[80px]">
          <svg width="80" height="80" className="transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="var(--color-card-border)"
              strokeWidth="6"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke={getMotivationColor()}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 32}
              animate={{
                strokeDashoffset:
                  (2 * Math.PI * 32 * (100 - momentum.percentage)) / 100,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="text-base font-semibold opacity-60"            
              >
              {momentum.percentage}%
            </div>
            <div className="text-[10px] opacity-60 leading-tight">complete</div>
          </div>
        </div>

        {/* dashboard stats */}
        <div className="flex-1 space-y-2">
          {[
            {
              label: "Habits",
              emoji: "💪",
              done: momentum.habitsCompleted,
              total: momentum.totalHabits,
              color: "#8B5CF6",
            },
            {
              label: "To-Dos",
              emoji: "📝",
              done: momentum.todosCompleted,
              total: momentum.totalTodos,
              color: "#EC4899",
            },
            {
              label: "Check-ins",
              emoji: "💬",
              done: momentum.todayCheckIns,
              total: momentum.totalCheckIns,
              color: "#10B981",
            },
          ].map((item) => {
            const percent =
              item.total > 0 ? (item.done / item.total) * 100 : 0;
            return (
              <div key={item.label} className="text-xs">
                <div className="flex justify-between mb-0.5">
                  <span className="opacity-70">{item.emoji} {item.label}</span>
                  <span className="opacity-60">
                    {item.done}/{item.total || 0}
                  </span>
                </div>
                <div className="w-full h-[5px] rounded-full bg-gray-100 dark:bg-gray-700/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: `${item.color}33`, // adds transparency
                      boxShadow: `0 0 6px ${item.color}66`, // soft glow
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
