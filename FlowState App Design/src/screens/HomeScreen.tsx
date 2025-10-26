// src/screens/HomeScreen.tsx
// adaptive dashboard home screen with theme-based background and time-of-day updates

import { useState, useEffect } from "react";
import { HealthWidget } from "../components/widget/HealthWidget";
import { WeeklySummaryCard } from "../components/card/WeeklySummaryCard";
import { WeatherMoonWidget } from "../components/widget/WeatherMoonWidget";
import { AdaptiveGreeting } from "../components/AdaptiveGreeting";
import { MoodCheckInWidget } from "../components/widget/MoodCheckInWidget";
import { QuickReflectionCard } from "../components/card/QuickReflectionCard";
import { getTimeOfDay } from "../components/background/adaptiveBackgrounds";
import { Moon, Footprints, Heart, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useTheme } from "../components/ThemeContext";

export function HomeScreen() {
  const { darkMode, themeColors } = useTheme();
  //const [adaptiveBg, setAdaptiveBg] = useState(getAdaptiveBackground());
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState(getTimeOfDay());

  // update background every minute
  useEffect(() => {
    const interval = setInterval(() => {
      //setAdaptiveBg(getAdaptiveBackground());
      setCurrentTimeOfDay(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoTime, setNewTodoTime] = useState<"morning" | "afternoon" | "evening">("morning");
  const [newTodoIcon, setNewTodoIcon] = useState("✨");

  return (
    <div
      className="min-h-screen transition-colors duration-700 relative"
      style={{
        background: darkMode
          ? themeColors.background
          : `linear-gradient(to bottom, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32 relative" style={{ zIndex: 2 }}>
        <div className="max-w-md mx-auto px-4">
          {/* adaptive greeting */}
          <AdaptiveGreeting />

          {/* time of day indicator */}
          <TimeOfDayIndicator />

          {/* weather & moon */}
          <WeatherMoonWidget />

          {/* mood check-in */}
          <MoodCheckInWidget />

          {/* health widgets */}
          <div className="flex gap-3 mb-6">
            <HealthWidget icon={<Moon size={20} />} label="Sleep" value="7h 20m" color="bg-blue-50" />
            <HealthWidget icon={<Footprints size={20} />} label="Steps" value="3,421" color="bg-peach-50" />
            <HealthWidget icon={<Heart size={20} />} label="Heart" value="68 bpm" color="bg-pink-50" />
          </div>

          {/* quick reflection */}
          <QuickReflectionCard />

          {/* weekly summary */}
          <WeeklySummaryCard />

          {/* morning block */}
          <div
            className={`mb-6 p-5 rounded-3xl shadow-sm transition-all duration-500 ${
              currentTimeOfDay === "morning" ? "bg-lavender-100 ring-2 ring-lavender-300" : "bg-lavender-50"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lavender-700">🌅 Morning</h2>
              {currentTimeOfDay === "morning" && (
                <span className="text-xs bg-lavender-200 px-3 py-1 rounded-full">Now</span>
              )}
            </div>
          </div>

          {/* afternoon block */}
          <div
            className={`mb-6 p-5 rounded-3xl shadow-sm transition-all duration-500 ${
              currentTimeOfDay === "afternoon" ? "bg-peach-100 ring-2 ring-orange-300" : "bg-peach-50"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-orange-700">☀️ Afternoon</h2>
              {currentTimeOfDay === "afternoon" && (
                <span className="text-xs bg-orange-200 px-3 py-1 rounded-full">Now</span>
              )}
            </div>
          </div>

          {/* evening block */}
          <div
            className={`mb-6 p-5 rounded-3xl shadow-sm transition-all duration-500 ${
              currentTimeOfDay === "evening" ? "bg-blue-100 ring-2 ring-blue-300" : "bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-blue-700">🌙 Evening</h2>
              {currentTimeOfDay === "evening" && (
                <span className="text-xs bg-blue-200 px-3 py-1 rounded-full">Now</span>
              )}
            </div>
          </div>

          {/* add to-do button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 rounded-3xl flow-card"
          >
            <Plus size={20} className="text-[var(--color-primary)]" />
            <span className="text-[var(--color-card-foreground)]">Add To-Do</span>
          </button>
        </div>
      </div>

      {/* add to-do modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] flow-card">
          <DialogHeader>
            <DialogTitle>Add New To-Do</DialogTitle>
            <DialogDescription>Create a gentle task for your day</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="e.g. Gentle yoga"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Time of Day</Label>
              <Select value={newTodoTime} onValueChange={(value: any) => setNewTodoTime(value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">🌅 Morning</SelectItem>
                  <SelectItem value="afternoon">☀️ Afternoon</SelectItem>
                  <SelectItem value="evening">🌙 Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={newTodoIcon}
                onChange={(e) => setNewTodoIcon(e.target.value)}
                placeholder="✨"
                className="rounded-xl"
                maxLength={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-card-foreground)] hover:opacity-80 transition-colors"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
