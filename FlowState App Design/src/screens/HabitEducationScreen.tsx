// src/screens/HabitEducationScreen.tsx
// teaches users the science of habit formation interactively

import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  Repeat,
  Target,
  Home,
  Link2,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface HabitCard {
  id: string;
  title: string;
  icon: any;
  color: string;
  explanation: string;
  visual:
    | "loop"
    | "stack"
    | "environment"
    | "identity"
    | "consistency"
    | "timing"
    | "reward"
    | "trigger"
    | "plateau"
    | "bundle";
  tryItPrompt: string;
  tryItPlaceholder: string;
  tryItExample: string;
}

const HABIT_CARDS: HabitCard[] = [
  {
    id: "habit-loops",
    title: "Habit Loops",
    icon: Repeat,
    color: "#a78bfa",
    explanation:
      "Every habit follows a pattern: Cue → Routine → Reward. Understanding this loop helps you build better habits and break bad ones.",
    visual: "loop",
    tryItPrompt: "Map out a habit loop for one of your habits:",
    tryItPlaceholder:
      "Example:\nCue: Wake up\nRoutine: Drink water\nReward: Feel refreshed",
    tryItExample:
      "Cue: Morning alarm • Routine: Morning stretch • Reward: Feel energized",
  },
  {
    id: "identity-based",
    title: "Identity-Based Habits",
    icon: Target,
    color: "#ec4899",
    explanation:
      'Don’t focus on goals—focus on who you want to become. "I’m a runner" is more powerful than "I want to run more."',
    visual: "identity",
    tryItPrompt: "Reframe a goal as an identity statement:",
    tryItPlaceholder:
      'Instead of: "I want to exercise more"\nReframe: "I am someone who moves my body daily"',
    tryItExample: "I am someone who prioritizes rest and recovery",
  },
  {
    id: "habit-stacking",
    title: "Habit Stacking",
    icon: Link2,
    color: "#3b82f6",
    explanation:
      'Link a new habit to an existing one. "After I [current habit], I will [new habit]." This creates automatic cues.',
    visual: "stack",
    tryItPrompt: "Create a habit stack:",
    tryItPlaceholder:
      "After I [existing habit], I will [new habit].\n\nExample: After I brush my teeth, I will do 5 push-ups.",
    tryItExample: "After I close my laptop, I will write 3 gratitudes",
  },
  {
    id: "environment-design",
    title: "Environment Design",
    icon: Home,
    color: "#10b981",
    explanation:
      "Your environment shapes your behavior. Make good habits easy and visible, bad habits hard and hidden.",
    visual: "environment",
    tryItPrompt: "Design your environment for one habit:",
    tryItPlaceholder:
      "Habit: Drink more water\nEnvironment change: Keep water bottle on desk",
    tryItExample: "Habit: Read before bed • Change: Book on pillow",
  },
  {
    id: "consistency-over-intensity",
    title: "Consistency Over Intensity",
    icon: TrendingUp,
    color: "#f97316",
    explanation:
      "Showing up matters more than how hard you go. Daily 10-minute walks beat occasional 2-hour gym sessions.",
    visual: "consistency",
    tryItPrompt: "Choose consistency over intensity for one habit:",
    tryItPlaceholder:
      "Instead of: Workout 90 min on weekends\nConsistent version: Move 15 min every day",
    tryItExample:
      "Instead of: Deep clean monthly • Consistent: Tidy 5 min daily",
  },
];

export function HabitEducationScreen() {
  const { themeColors } = useTheme();
  const [selectedCard, setSelectedCard] = useState<HabitCard | null>(null);
  const [userInput, setUserInput] = useState("");
  const [completedCards, setCompletedCards] = useState<string[]>(() => {
    const saved = localStorage.getItem("flowstate-habit-education-completed");
    return saved ? JSON.parse(saved) : [];
  });

  const handleTryIt = () => {
    if (!selectedCard) return;
    if (!userInput.trim()) {
      alert("Please fill in your response first.");
      return;
    }

    if (!completedCards.includes(selectedCard.id)) {
      const updated = [...completedCards, selectedCard.id];
      setCompletedCards(updated);
      localStorage.setItem(
        "flowstate-habit-education-completed",
        JSON.stringify(updated)
      );
    }

    const savedWork =
      JSON.parse(localStorage.getItem("flowstate-habit-education-work") || "{}") ||
      {};
    savedWork[selectedCard.id] = {
      input: userInput,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(
      "flowstate-habit-education-work",
      JSON.stringify(savedWork)
    );

    alert("Great work! Applied to your habits 🌟");
    setUserInput("");
    setSelectedCard(null);
  };

  return (
    <div
      className="min-h-screen pb-32"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
      }}
    >
      <div className="p-6 md:p-8 pt-12 md:pt-16 max-w-4xl mx-auto">
        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Lightbulb size={28} style={{ color: themeColors.primary }} />
            <h1>Learn About Habits</h1>
          </div>
          <p className="opacity-70">
            Understanding the psychology of behavior change
          </p>
        </div>

        {/* progress bar */}
        <div className="flow-card">
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className="opacity-60">Your Progress</span>
            <span style={{ color: themeColors.primary }}>
              {completedCards.length} / {HABIT_CARDS.length} completed
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                backgroundColor: themeColors.primary,
                width: `${
                  (completedCards.length / HABIT_CARDS.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* cards grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {HABIT_CARDS.map((card) => {
            const Icon = card.icon;
            const isCompleted = completedCards.includes(card.id);
            return (
              <div
                key={card.id}
                className="flow-card"
              >
                <div
                  className="px-6 pt-6 pb-3"
                  style={{ backgroundColor: `${card.color}10` }}
                >
                  <Icon size={24} style={{ color: card.color }} />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3>{card.title}</h3>
                    {isCompleted && (
                      <CheckCircle2
                        size={18}
                        style={{ color: card.color }}
                        className="flex-shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-sm opacity-80 mb-3 leading-relaxed">
                    {card.explanation}
                  </p>
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="w-full py-2 rounded-xl text-white text-sm flex items-center justify-center gap-2 shadow-md"
                    style={{ backgroundColor: card.color }}
                  >
                    <Sparkles size={16} /> Try It <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* encouragement */}
        {completedCards.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border text-center">
            <p>
              {completedCards.length === HABIT_CARDS.length
                ? "🎉 Amazing! You've completed all the habit lessons!"
                : `Great work! You've applied ${completedCards.length} concept${
                    completedCards.length > 1 ? "s" : ""
                  } to your habits. Keep going! 🌟`}
            </p>
          </div>
        )}
      </div>

      {/* modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="flow-card">
            {/* header */}
            <div
              className="p-6 text-white relative"
              style={{ backgroundColor: selectedCard.color }}
            >
              <button
                onClick={() => {
                  setSelectedCard(null);
                  setUserInput("");
                }}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 mb-1">
                {(() => {
                  const Icon = selectedCard.icon;
                  return <Icon size={26} />;
                })()}
                <h2>{selectedCard.title}</h2>
              </div>
              <p className="text-white/90 text-sm">
                {selectedCard.explanation}
              </p>
            </div>

            {/* content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="mb-2">{selectedCard.tryItPrompt}</h3>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={selectedCard.tryItPlaceholder}
                rows={6}
                className="w-full p-3 rounded-xl border text-sm resize-none"
                style={{ borderColor: selectedCard.color }}
              />
              <div
                className="mt-4 p-4 rounded-xl border-l-4 text-sm"
                style={{
                  borderColor: selectedCard.color,
                  backgroundColor: `${selectedCard.color}10`,
                }}
              >
                <p className="opacity-60 text-xs mb-1">Example:</p>
                <p>{selectedCard.tryItExample}</p>
              </div>
            </div>

            {/* footer */}
            <div className="p-6 border-t">
              <button
                onClick={handleTryIt}
                className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: selectedCard.color }}
              >
                <CheckCircle2 size={18} /> Apply to My Habits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
