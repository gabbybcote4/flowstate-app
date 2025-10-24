import { useState, useEffect } from 'react';
//import { motion } from '../lib/motion-shim';
import { useTheme } from '../ThemeContext';
import { Sparkles, ArrowRight } from 'lucide-react';
//import { toast } from 'sonner@2.0.3';
import { getLocalStorageItem, setLocalStorageItem } from '../../hooks/useLocalStorage';

export function MoodCheckInWidget() {
  const { themeColors } = useTheme();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [mood, setMood] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if already checked in today
    const savedDate = getLocalStorageItem('flowstate-mood-checkin-date', null);
    const today = new Date().toDateString();
    setHasCheckedIn(savedDate === today);
  }, []);

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    setLocalStorageItem('flowstate-mood-checkin-date', today);
    setLocalStorageItem('flowstate-mood-checkin-value', mood.toString());
    
    setHasCheckedIn(true);
    setIsExpanded(false);
    
    //const moodLabels = ['struggling', 'low', 'okay', 'good', 'great'];
    //toast.success(`Checked in: feeling ${moodLabels[mood - 1]} 💜`, { duration: 2000 });
  };

  const getMoodEmoji = (value: number) => {
    const emojis = ['😔', '😕', '😐', '🙂', '😊'];
    return emojis[value - 1];
  };

  const getMoodLabel = (value: number) => {
    const labels = ['Struggling', 'Low', 'Okay', 'Good', 'Great'];
    return labels[value - 1];
  };

  if (hasCheckedIn && !isExpanded) {
    return (
      < button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-[var(--color-card)] rounded-2xl shadow-md p-4 mb-6 text-left"
        //whileHover={{ scale: 1.01 }}
        //whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getMoodEmoji(parseInt(getLocalStorageItem('flowstate-mood-checkin-value', '3')))}</span>
            <div>
              <div className="text-sm opacity-60">Mood today</div>
              <div className="text-sm">Already checked in</div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Sparkles size={16} className="text-green-600" />
          </div>
        </div>
      </ button>
    );
  }

  return (
    < div 
      className="bg-[var(--color-card)] rounded-3xl shadow-md p-5 mb-6 relative"
    >
      <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">MOOD CHECK-IN</div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} style={{ color: themeColors.primary }} />
        <h3>Quick Mood Check-In</h3>
      </div>

      <div className="mb-4">
        <div className="flex justify-center items-center gap-4 mb-3">
          <span className="text-5xl">{getMoodEmoji(mood)}</span>
        </div>
        <div className="text-center mb-4 opacity-70">
          {getMoodLabel(mood)}
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={mood}
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${themeColors.primary} 0%, ${themeColors.primary} ${((mood - 1) / 4) * 100}%, #e5e7eb ${((mood - 1) / 4) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs opacity-50 mt-2">
          <span>Low</span>
          <span>Great</span>
        </div>
      </div>

      < button
        //whileHover={{ scale: 1.02 }}
        //whileTap={{ scale: 0.98 }}
        onClick={handleCheckIn}
        className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2 transition-all"
        style={{ backgroundColor: themeColors.primary }}
      >
        <span>Check In</span>
        <ArrowRight size={18} />
      </ button>
    </ div>
  );
}