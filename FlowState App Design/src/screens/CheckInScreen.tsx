// src/screens/CheckInScreen.tsx
// adaptive mood check-in screen — theme + dark mode aligned

import { useState, useEffect } from "react";
import { MoodButton } from "../components/MoodButton";
import { useTheme } from "../components/ThemeContext";
import { useActivityNudges } from "../components/system/NudgeSystem";

interface CheckInScreenProps {
  onComplete: (mood: string) => void;
}

export function CheckInScreen({ onComplete }: CheckInScreenProps) {
  const { themeColors, darkMode } = useTheme();
  const { showMorningNudge } = useActivityNudges();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => showMorningNudge(), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)
      return {
        greeting: "good morning",
        prompt: "how are you feeling this morning?",
      };
    if (hour >= 12 && hour < 17)
      return {
        greeting: "good afternoon",
        prompt: "how are you feeling this afternoon?",
      };
    if (hour >= 17 && hour < 21)
      return {
        greeting: "good evening",
        prompt: "how are you feeling this evening?",
      };
    return { greeting: "hello", prompt: "how are you feeling right now?" };
  };

  const userName = localStorage.getItem("flowstate-username") || "friend";
  const { greeting, prompt } = getTimeGreeting();

  const handleSubmit = () => {
    if (!selectedMood) return;
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("flowstate-mood-date", today);
    localStorage.setItem("flowstate-mood", selectedMood);

    const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    moodHistory.push({ date: new Date().toISOString(), mood: selectedMood });
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

    window.dispatchEvent(new Event("flowstate-update"));
    onComplete(selectedMood);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative transition-colors duration-700"
      style={{
        background: darkMode
          ? themeColors.background
          : `linear-gradient(to bottom right, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      <div className="flex-1 flex flex-col p-4 md:p-6 pt-12 pb-28">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full items-center px-4">
          {/* greeting section */}
          <div className="text-center mb-12">
            <h1
              className="mb-3 capitalize text-[var(--color-card-foreground)]"
              style={{
                fontSize: "28px",
                fontWeight: 600,
              }}
            >
              {greeting}, {userName}
            </h1>
            <p
              className="opacity-80 text-[var(--color-card-foreground)]"
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              {prompt}
            </p>
          </div>

          {/* mood selection */}
          <div className="flex flex-col gap-4 w-full">
            <MoodButton
              label="low energy"
              color={themeColors.primaryLight}
              textColor={darkMode ? "#e2e8f0" : "#1e293b"}
              selected={selectedMood === "low"}
              onClick={() => setSelectedMood("low")}
            />
            <MoodButton
              label="moderate energy"
              color={themeColors.accentLight}
              textColor={darkMode ? "#e2e8f0" : "#1e293b"}
              selected={selectedMood === "moderate"}
              onClick={() => setSelectedMood("moderate")}
            />
            <MoodButton
              label="good energy"
              color={themeColors.primary}
              textColor="#ffffff"
              selected={selectedMood === "good"}
              onClick={() => setSelectedMood("good")}
            />
          </div>
        </div>

        {/* submit button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className="py-4 w-48 h-20 text-center rounded-3xl text-white shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: selectedMood
                ? `linear-gradient(135deg, ${themeColors.primaryLight}, ${themeColors.primaryDark})`
                : `${themeColors.primaryLight}99`,
              boxShadow: selectedMood
                ? `0 8px 30px ${themeColors.primaryLight}55`
                : "none",
            }}
          >
            build my plan
          </button>
        </div>
      </div>
    </div>
  );
}
