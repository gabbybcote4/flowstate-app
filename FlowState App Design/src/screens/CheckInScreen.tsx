import { useState, useEffect } from "react";import { MoodButton } from "../components/button/MoodButton";
//import { DevTag } from '../components/overlay/DevTag';
import { useTheme } from "../components/context/ThemeContext";
import { useActivityNudges } from "../components/system/NudgeSystem";
//import { setLocalStorageItem } from "../hooks/useLocalStorage";

interface CheckInScreenProps {
  onComplete: (mood: string) => void;
}

export function CheckInScreen({
  onComplete,
}: CheckInScreenProps) {
 const { themeColors } = useTheme();
  const { showMorningNudge } = useActivityNudges();
  
  // Show morning nudge when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      showMorningNudge();
    }, 2000); // Show after 2 seconds
    
    return () => clearTimeout(timer);
  }, []);
  const [selectedMood, setSelectedMood] = useState<
    string | null
  >(null);

  // Get time-appropriate greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { greeting: 'Good morning', prompt: 'How are you feeling this morning?' };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: 'Good afternoon', prompt: 'How are you feeling this afternoon?' };
    } else if (hour >= 17 && hour < 21) {
      return { greeting: 'Good evening', prompt: 'How are you feeling this evening?' };
    } else {
      return { greeting: 'Hello', prompt: 'How are you feeling right now?' };
    }
  };

  const { greeting, prompt } = getTimeGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-100 via-lavender-50 to-white flex flex-col relative">
      <div className="absolute top-0 left-0 bg-black/75 text-white px-2 py-1 text-sm rounded-br z-50">CHECK-IN SCREEN</div>
      <div className="flex-1 flex flex-col p-4 md:p-6 pt-8 md:pt-12 pb-28">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full items-center px-4">
          <div className="text-center p-16 mb-12">
            <h1 className="mb-3">{greeting}, Gabrielle</h1>
            <p className="opacity-70">
              {prompt}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <MoodButton
              label="Low Energy"
              color="bg-blue-100 text-blue-700"
              selected={selectedMood === "low"}
              onClick={() => setSelectedMood("low")}
            />
            <MoodButton
              label="Moderate Energy"
              color="bg-peach-100 text-orange-700"
              selected={selectedMood === "moderate"}
              onClick={() => setSelectedMood("moderate")}
            />
            <MoodButton
              label="Good Energy"
              color="bg-green-100 text-green-700"
              selected={selectedMood === "good"}
              onClick={() => setSelectedMood("good")}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full items-center">
          <button
            onClick={() => {
              if (selectedMood) {
                console.log('✅ Check-in complete with mood:', selectedMood);
                
                // Save to mood history for weekly tracking
                const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
                moodHistory.push({
                  date: new Date().toISOString(),
                  mood: selectedMood,
                });
                localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
                
                // Call onComplete which will handle state update and navigation
                console.log('📍 Calling onComplete to navigate to home...');
                onComplete(selectedMood);
              }
            }}
            disabled={!selectedMood}
            className="py-4 w-48 h-24 text-center rounded-3xl text-white shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed px-[16px] py-[0px]"
            style={{
              backgroundColor: selectedMood ? themeColors.primary : themeColors.primaryLight,
            }}
          >
            Build My Plan
          </button>
        </div>
      </div>
    </div>
  );
}